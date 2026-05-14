import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

admin.initializeApp();

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

const db = admin.firestore();
const storage = admin.storage();
const region = "asia-south1";

function requireAuth(request) {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "Sign in to use LockOn Revision.");
  }
  return request.auth.uid;
}

function getGemini(apiKey) {
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.35,
      responseMimeType: "application/json",
    },
  });
}

function parseJson(text) {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
}

function assertUserFile(uid, fileDoc) {
  if (!fileDoc.exists) {
    throw new HttpsError("not-found", "File metadata was not found.");
  }
  const file = fileDoc.data();
  if (!file.storagePath?.startsWith(`users/${uid}/uploads/`)) {
    throw new HttpsError("permission-denied", "This file does not belong to the current user.");
  }
  return file;
}

async function downloadFileAsGeminiPart(file) {
  const [bytes] = await storage.bucket().file(file.storagePath).download();
  return {
    inlineData: {
      data: bytes.toString("base64"),
      mimeType: file.type || "text/plain",
    },
  };
}

async function writeGeneratedCourse(uid, fileId, generated) {
  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();

  for (const subject of generated.subjects || []) {
    const subjectRef = db.collection("users").doc(uid).collection("subjects").doc();
    batch.set(subjectRef, {
      title: subject.title,
      description: subject.description || "",
      unitCount: subject.units?.length || 0,
      sourceFileId: fileId,
      createdAt: now,
      updatedAt: now,
    });

    for (const unit of subject.units || []) {
      const unitRef = db.collection("users").doc(uid).collection("units").doc();
      batch.set(unitRef, {
        subjectId: subjectRef.id,
        subjectName: subject.title,
        title: unit.title,
        summary: unit.summary || "",
        sourceFileId: fileId,
        createdAt: now,
        updatedAt: now,
      });

      for (const lesson of unit.lessons || []) {
        const lessonRef = db.collection("users").doc(uid).collection("lessons").doc();
        batch.set(lessonRef, {
          subjectId: subjectRef.id,
          unitId: unitRef.id,
          subjectName: subject.title,
          unitName: unit.title,
          title: lesson.title,
          summary: lesson.summary || "",
          keyPoints: lesson.keyPoints || [],
          mastery: 45,
          difficulty: lesson.difficulty || "medium",
          sourceFileId: fileId,
          createdAt: now,
          updatedAt: now,
        });

        for (const question of lesson.questions || []) {
          const questionRef = db.collection("users").doc(uid).collection("questions").doc();
          const options = Array.isArray(question.options) ? question.options.slice(0, 4) : [];
          batch.set(questionRef, {
            subjectId: subjectRef.id,
            unitId: unitRef.id,
            lessonId: lessonRef.id,
            subjectName: subject.title,
            unitName: unit.title,
            lessonTitle: lesson.title,
            prompt: question.prompt,
            options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || "",
            topic: question.topic || lesson.title,
            difficulty: question.difficulty || lesson.difficulty || "medium",
            mastery: 45,
            attempts: 0,
            correctAttempts: 0,
            sourceFileId: fileId,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }
  }

  batch.update(db.collection("users").doc(uid).collection("files").doc(fileId), {
    status: "processed",
    processedAt: now,
  });
  batch.update(db.collection("users").doc(uid), {
    "dailyUsage.uploadsProcessed": admin.firestore.FieldValue.increment(1),
    "dailyUsage.aiRequests": admin.firestore.FieldValue.increment(1),
    updatedAt: now,
  });
  await batch.commit();
}

export const processUploadedNotes = onCall({ region, secrets: [GEMINI_API_KEY], timeoutSeconds: 180 }, async (request) => {
  const uid = requireAuth(request);
  const { fileId } = request.data || {};
  if (!fileId) throw new HttpsError("invalid-argument", "fileId is required.");

  const fileRef = db.collection("users").doc(uid).collection("files").doc(fileId);
  const fileDoc = await fileRef.get();
  const file = assertUserFile(uid, fileDoc);
  await fileRef.update({ status: "processing", updatedAt: admin.firestore.FieldValue.serverTimestamp() });

  const model = getGemini(GEMINI_API_KEY.value());
  const filePart = await downloadFileAsGeminiPart(file);
  const prompt = `Create structured active-recall content from this user's uploaded notes.
Return strict JSON only with this shape:
{
  "subjects": [
    {
      "title": "string",
      "description": "string",
      "units": [
        {
          "title": "string",
          "summary": "string",
          "lessons": [
            {
              "title": "string",
              "summary": "string",
              "difficulty": "easy|medium|hard",
              "keyPoints": ["string"],
              "questions": [
                {
                  "prompt": "string",
                  "options": ["A", "B", "C", "D"],
                  "correctAnswer": "must exactly match one option",
                  "explanation": "string",
                  "topic": "string",
                  "difficulty": "easy|medium|hard"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
Prefer concise lessons, 3-6 questions per lesson, and factual questions grounded only in the file.`;

  try {
    const result = await model.generateContent([prompt, filePart]);
    const generated = parseJson(result.response.text());
    await writeGeneratedCourse(uid, fileId, generated);
    return { ok: true };
  } catch (error) {
    await fileRef.update({
      status: "failed",
      error: error.message,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    throw new HttpsError("internal", "AI processing failed. Try a clearer notes file.");
  }
});

export const aiTutorChat = onCall({ region, secrets: [GEMINI_API_KEY], timeoutSeconds: 60 }, async (request) => {
  const uid = requireAuth(request);
  const { messages = [], context = {} } = request.data || {};
  if (!Array.isArray(messages) || messages.length > 20) {
    throw new HttpsError("invalid-argument", "Provide up to 20 chat messages.");
  }

  const model = getGemini(GEMINI_API_KEY.value());
  const transcript = messages.map((message) => `${message.role}: ${message.content}`).join("\n");
  const result = await model.generateContent([
    `You are LockOn Revision's AI tutor. Be clear, concise, and active-recall focused.
User id: ${uid}
Plan: ${context.plan || "Free"}
Return JSON: {"reply":"string"}`,
    transcript,
  ]);

  await db.collection("users").doc(uid).update({
    "dailyUsage.aiRequests": admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return parseJson(result.response.text());
});

export const generateQuestionHint = onCall({ region, secrets: [GEMINI_API_KEY], timeoutSeconds: 45 }, async (request) => {
  const uid = requireAuth(request);
  const { questionId } = request.data || {};
  const questionDoc = await db.collection("users").doc(uid).collection("questions").doc(questionId).get();
  if (!questionDoc.exists) throw new HttpsError("not-found", "Question not found.");
  const question = questionDoc.data();

  const model = getGemini(GEMINI_API_KEY.value());
  const result = await model.generateContent([
    `Return JSON: {"hint":"one short hint that helps without revealing the answer"}`,
    JSON.stringify({ prompt: question.prompt, options: question.options, topic: question.topic }),
  ]);
  return parseJson(result.response.text());
});

export const explainWrongAnswer = onCall({ region, secrets: [GEMINI_API_KEY], timeoutSeconds: 45 }, async (request) => {
  const uid = requireAuth(request);
  const { questionId, selectedAnswer } = request.data || {};
  const questionDoc = await db.collection("users").doc(uid).collection("questions").doc(questionId).get();
  if (!questionDoc.exists) throw new HttpsError("not-found", "Question not found.");
  const question = questionDoc.data();

  const model = getGemini(GEMINI_API_KEY.value());
  const result = await model.generateContent([
    `Return JSON: {"explanation":"brief explanation of why the selected answer is wrong and why the correct answer is right"}`,
    JSON.stringify({
      prompt: question.prompt,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    }),
  ]);
  return parseJson(result.response.text());
});
