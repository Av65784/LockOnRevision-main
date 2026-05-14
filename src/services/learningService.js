import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { db, functions, isFirebaseConfigured, storage } from "../config/firebase.js";
import { getLocalUser, makeId, subscribeLocalState, updateLocalUser } from "./localStore.js";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const geminiModel = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

function hasGeminiKey() {
  return Boolean(geminiApiKey);
}

function parseGeminiJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

async function callGeminiJson(prompt, fallbackValue) {
  if (!hasGeminiKey()) return fallbackValue;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.35,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
    const payload = await response.json();
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini returned no text.");
    return parseGeminiJson(text);
  } catch (error) {
    console.warn(error);
    return fallbackValue;
  }
}

function localList(uid, name) {
  return getLocalUser(uid)?.[name] || [];
}

function sortByUpdated(items) {
  return [...items].sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

function emitLocalCollection(uid, name, callback) {
  return subscribeLocalState(() => {
    const items = localList(uid, name);
    if (name === "questions") {
      callback(sortByUpdated(items.filter((item) => Number(item.mastery || 0) < 70)).slice(0, 20));
      return;
    }
    callback(sortByUpdated(items).slice(0, name === "lessons" ? 24 : undefined));
  });
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 28);
}

function titleFromText(text, fallback) {
  const firstLine = text
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);
  return (firstLine || fallback || "Uploaded Notes").slice(0, 72);
}

function buildLocalCourse(uid, sourceText, sourceFileId = null) {
  const now = new Date().toISOString();
  const cleanText = sourceText.trim() || "Active recall revision notes. Add clearer notes for better generated questions.";
  const sentences = splitSentences(cleanText);
  const chunks = [];
  for (let index = 0; index < Math.max(1, sentences.length); index += 4) {
    chunks.push(sentences.slice(index, index + 4));
  }
  const selectedChunks = chunks.slice(0, 6);

  const subject = {
    id: makeId("subject"),
    title: titleFromText(cleanText, "My Notes"),
    description: "Generated locally from your notes.",
    unitCount: Math.max(1, Math.ceil(selectedChunks.length / 2)),
    sourceFileId,
    createdAt: now,
    updatedAt: now,
  };

  const units = [];
  const lessons = [];
  const questions = [];

  selectedChunks.forEach((chunk, index) => {
    const unitIndex = Math.floor(index / 2) + 1;
    let unit = units.find((item) => item.title === `Unit ${unitIndex}`);
    if (!unit) {
      unit = {
        id: makeId("unit"),
        subjectId: subject.id,
        subjectName: subject.title,
        title: `Unit ${unitIndex}`,
        summary: chunk[0] || "Core ideas from your notes.",
        sourceFileId,
        createdAt: now,
        updatedAt: now,
      };
      units.push(unit);
    }

    const lessonText = chunk.join(" ");
    const lesson = {
      id: makeId("lesson"),
      subjectId: subject.id,
      unitId: unit.id,
      subjectName: subject.title,
      unitName: unit.title,
      title: chunk[0]?.replace(/[.!?]$/, "").slice(0, 64) || `Lesson ${index + 1}`,
      summary: lessonText || "Review the main idea and test yourself.",
      keyPoints: chunk.slice(0, 4),
      mastery: 45,
      difficulty: index > 2 ? "hard" : index > 0 ? "medium" : "easy",
      sourceFileId,
      createdAt: now,
      updatedAt: now,
    };
    lessons.push(lesson);

    const answer = chunk[0] || lesson.title;
    questions.push({
      id: makeId("question"),
      subjectId: subject.id,
      unitId: unit.id,
      lessonId: lesson.id,
      subjectName: subject.title,
      unitName: unit.title,
      lessonTitle: lesson.title,
      prompt: `Which statement best captures this lesson: "${lesson.title}"?`,
      options: [
        answer,
        "It is unrelated to the uploaded notes.",
        "It only describes formatting, not meaning.",
        "It says revision is unnecessary.",
      ],
      correctAnswer: answer,
      explanation: `The correct answer is taken directly from the lesson summary: ${answer}`,
      topic: lesson.title,
      difficulty: lesson.difficulty,
      mastery: 45,
      attempts: 0,
      correctAttempts: 0,
      sourceFileId,
      createdAt: now,
      updatedAt: now,
    });
  });

  updateLocalUser(uid, (userData) => ({
    ...userData,
    subjects: [subject, ...userData.subjects],
    units: [...units, ...userData.units],
    lessons: [...lessons, ...userData.lessons],
    questions: [...questions, ...userData.questions],
    profile: {
      ...userData.profile,
      dailyUsage: {
        ...userData.profile.dailyUsage,
        aiRequests: Number(userData.profile.dailyUsage?.aiRequests || 0) + 1,
        uploadsProcessed: Number(userData.profile.dailyUsage?.uploadsProcessed || 0) + 1,
      },
    },
  }));

  return { subject, units, lessons, questions };
}

function fallbackCourseJson(sourceText) {
  const cleanText = sourceText.trim() || "Active recall revision notes.";
  const sentences = splitSentences(cleanText);
  const chunks = [];
  for (let index = 0; index < Math.max(1, sentences.length); index += 4) {
    chunks.push(sentences.slice(index, index + 4));
  }

  return {
    subjects: [
      {
        title: titleFromText(cleanText, "My Notes"),
        description: "Generated from your notes.",
        units: chunks.slice(0, 3).map((chunk, index) => ({
          title: `Unit ${index + 1}`,
          summary: chunk[0] || "Core ideas from your notes.",
          lessons: [
            {
              title: (chunk[0] || `Lesson ${index + 1}`).replace(/[.!?]$/, "").slice(0, 64),
              summary: chunk.join(" ") || "Review the main idea and test yourself.",
              difficulty: index > 1 ? "hard" : index > 0 ? "medium" : "easy",
              keyPoints: chunk.slice(0, 4),
              questions: [
                {
                  prompt: `Which statement best captures this lesson?`,
                  options: [
                    chunk[0] || "The main idea from the notes.",
                    "It is unrelated to the uploaded notes.",
                    "It only describes formatting, not meaning.",
                    "It says revision is unnecessary.",
                  ],
                  correctAnswer: chunk[0] || "The main idea from the notes.",
                  explanation: "The correct answer is grounded in the notes you provided.",
                  topic: chunk[0] || "Main idea",
                  difficulty: index > 1 ? "hard" : index > 0 ? "medium" : "easy",
                },
              ],
            },
          ],
        })),
      },
    ],
  };
}

function writeGeminiCourse(uid, generated, sourceFileId = null) {
  const now = new Date().toISOString();
  const subjects = [];
  const units = [];
  const lessons = [];
  const questions = [];

  (generated.subjects || []).forEach((subjectInput) => {
    const subject = {
      id: makeId("subject"),
      title: subjectInput.title || "Generated Subject",
      description: subjectInput.description || "Generated by Gemini from your notes.",
      unitCount: subjectInput.units?.length || 0,
      sourceFileId,
      createdAt: now,
      updatedAt: now,
    };
    subjects.push(subject);

    (subjectInput.units || []).forEach((unitInput) => {
      const unit = {
        id: makeId("unit"),
        subjectId: subject.id,
        subjectName: subject.title,
        title: unitInput.title || "Generated Unit",
        summary: unitInput.summary || "",
        sourceFileId,
        createdAt: now,
        updatedAt: now,
      };
      units.push(unit);

      (unitInput.lessons || []).forEach((lessonInput) => {
        const lesson = {
          id: makeId("lesson"),
          subjectId: subject.id,
          unitId: unit.id,
          subjectName: subject.title,
          unitName: unit.title,
          title: lessonInput.title || "Generated Lesson",
          summary: lessonInput.summary || "",
          keyPoints: lessonInput.keyPoints || [],
          mastery: 45,
          difficulty: lessonInput.difficulty || "medium",
          sourceFileId,
          createdAt: now,
          updatedAt: now,
        };
        lessons.push(lesson);

        (lessonInput.questions || []).forEach((questionInput) => {
          const options = Array.isArray(questionInput.options) ? questionInput.options.slice(0, 4) : [];
          questions.push({
            id: makeId("question"),
            subjectId: subject.id,
            unitId: unit.id,
            lessonId: lesson.id,
            subjectName: subject.title,
            unitName: unit.title,
            lessonTitle: lesson.title,
            prompt: questionInput.prompt || `What is the key idea in ${lesson.title}?`,
            options,
            correctAnswer: questionInput.correctAnswer || options[0],
            explanation: questionInput.explanation || "",
            topic: questionInput.topic || lesson.title,
            difficulty: questionInput.difficulty || lesson.difficulty,
            mastery: 45,
            attempts: 0,
            correctAttempts: 0,
            sourceFileId,
            createdAt: now,
            updatedAt: now,
          });
        });
      });
    });
  });

  if (!subjects.length || !questions.length) {
    return buildLocalCourse(uid, "Gemini returned too little content. Please paste clearer notes.", sourceFileId);
  }

  updateLocalUser(uid, (userData) => ({
    ...userData,
    subjects: [...subjects, ...userData.subjects],
    units: [...units, ...userData.units],
    lessons: [...lessons, ...userData.lessons],
    questions: [...questions, ...userData.questions],
    profile: {
      ...userData.profile,
      dailyUsage: {
        ...userData.profile.dailyUsage,
        aiRequests: Number(userData.profile.dailyUsage?.aiRequests || 0) + 1,
        uploadsProcessed: Number(userData.profile.dailyUsage?.uploadsProcessed || 0) + 1,
      },
    },
  }));

  return { subjects, units, lessons, questions };
}

async function buildGeminiCourse(uid, sourceText, sourceFileId = null) {
  const prompt = `Create structured active-recall learning content from these notes.
Return strict JSON only with this exact shape:
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
Create concise lessons, 3-5 recall questions per lesson, and only use facts grounded in the notes.

NOTES:
${sourceText}`;

  const fallback = null;
  const generated = await callGeminiJson(prompt, fallback);
  return generated ? writeGeminiCourse(uid, generated, sourceFileId) : buildLocalCourse(uid, sourceText, sourceFileId);
}

async function writeFirebaseCourse(uid, generated, sourceFileId = null) {
  const created = {
    subjects: [],
    units: [],
    lessons: [],
    questions: [],
  };

  for (const subjectInput of generated.subjects || []) {
    const subjectRef = await addDoc(collection(db, "users", uid, "subjects"), {
      title: subjectInput.title || "Generated Subject",
      description: subjectInput.description || "Generated from your notes.",
      unitCount: subjectInput.units?.length || 0,
      sourceFileId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    created.subjects.push(subjectRef.id);

    for (const unitInput of subjectInput.units || []) {
      const unitRef = await addDoc(collection(db, "users", uid, "units"), {
        subjectId: subjectRef.id,
        subjectName: subjectInput.title || "Generated Subject",
        title: unitInput.title || "Generated Unit",
        summary: unitInput.summary || "",
        sourceFileId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      created.units.push(unitRef.id);

      for (const lessonInput of unitInput.lessons || []) {
        const lessonRef = await addDoc(collection(db, "users", uid, "lessons"), {
          subjectId: subjectRef.id,
          unitId: unitRef.id,
          subjectName: subjectInput.title || "Generated Subject",
          unitName: unitInput.title || "Generated Unit",
          title: lessonInput.title || "Generated Lesson",
          summary: lessonInput.summary || "",
          keyPoints: lessonInput.keyPoints || [],
          mastery: 45,
          difficulty: lessonInput.difficulty || "medium",
          sourceFileId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        created.lessons.push(lessonRef.id);

        for (const questionInput of lessonInput.questions || []) {
          const options = Array.isArray(questionInput.options) ? questionInput.options.slice(0, 4) : [];
          const questionRef = await addDoc(collection(db, "users", uid, "questions"), {
            subjectId: subjectRef.id,
            unitId: unitRef.id,
            lessonId: lessonRef.id,
            subjectName: subjectInput.title || "Generated Subject",
            unitName: unitInput.title || "Generated Unit",
            lessonTitle: lessonInput.title || "Generated Lesson",
            prompt: questionInput.prompt || `What is the key idea in ${lessonInput.title || "this lesson"}?`,
            options,
            correctAnswer: questionInput.correctAnswer || options[0],
            explanation: questionInput.explanation || "",
            topic: questionInput.topic || lessonInput.title || "Generated Lesson",
            difficulty: questionInput.difficulty || lessonInput.difficulty || "medium",
            mastery: 45,
            attempts: 0,
            correctAttempts: 0,
            sourceFileId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          created.questions.push(questionRef.id);
        }
      }
    }
  }

  await updateDoc(doc(db, "users", uid), {
    "dailyUsage.aiRequests": increment(1),
    "dailyUsage.uploadsProcessed": increment(1),
    updatedAt: serverTimestamp(),
  });

  return created;
}

async function buildFirebaseGeminiCourse(uid, sourceText, sourceFileId = null) {
  const prompt = `Create structured active-recall learning content from these notes.
Return strict JSON only with this exact shape:
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
Create concise lessons, 3-5 recall questions per lesson, and only use facts grounded in the notes.

NOTES:
${sourceText}`;

  const generated = await callGeminiJson(prompt, fallbackCourseJson(sourceText));
  return writeFirebaseCourse(uid, generated, sourceFileId);
}

export function subscribeUserCollection(uid, name, callback, constraints = []) {
  if (!isFirebaseConfigured) {
    return emitLocalCollection(uid, name, callback);
  }
  return onSnapshot(query(collection(db, "users", uid, name), ...constraints), (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export function subscribeSubjects(uid, callback) {
  return subscribeUserCollection(uid, "subjects", callback, [orderBy("updatedAt", "desc")]);
}

export function subscribeLessons(uid, callback) {
  return subscribeUserCollection(uid, "lessons", callback, [orderBy("updatedAt", "desc"), limit(24)]);
}

export function subscribeWeakQuestions(uid, callback) {
  return subscribeUserCollection(uid, "questions", callback, [
    where("mastery", "<", 70),
    orderBy("mastery", "asc"),
    limit(20),
  ]);
}

export async function getWrongAnswers(uid) {
  if (!isFirebaseConfigured) {
    return sortByUpdated(localList(uid, "answers").filter((answer) => !answer.isCorrect)).slice(0, 20);
  }
  const snapshot = await getDocs(
    query(
      collection(db, "users", uid, "answers"),
      where("isCorrect", "==", false),
      orderBy("answeredAt", "desc"),
      limit(20),
    ),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function uploadNoteFile(uid, file, onProgress) {
  if (!isFirebaseConfigured) {
    onProgress?.(35);
    const content = /\.(txt|md)$/i.test(file.name) ? await file.text() : `Notes uploaded as ${file.name}.`;
    onProgress?.(100);
    const localFile = {
      id: makeId("file"),
      name: file.name,
      size: file.size,
      type: file.type,
      content,
      status: "uploaded",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateLocalUser(uid, (userData) => ({ ...userData, files: [localFile, ...userData.files] }));
    return localFile;
  }

  const cleanName = file.name.replace(/[^\w.\-]+/g, "-").toLowerCase();
  const path = `users/${uid}/uploads/${Date.now()}-${cleanName}`;
  const fileRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(fileRef, file, {
    contentType: file.type,
    customMetadata: { owner: uid },
  });

  await new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      resolve,
    );
  });

  const url = await getDownloadURL(fileRef);
  const fileDoc = await addDoc(collection(db, "users", uid, "files"), {
    name: file.name,
    size: file.size,
    type: file.type,
    storagePath: path,
    url,
    status: "uploaded",
    createdAt: serverTimestamp(),
  });

  return { id: fileDoc.id, url, storagePath: path };
}

export async function processUploadedFile(fileId) {
  if (!isFirebaseConfigured) {
    const state = JSON.parse(localStorage.getItem("lockon-revision-local-state") || "{}");
    const uid = state.currentUserId;
    const file = uid ? state.users?.[uid]?.files?.find((item) => item.id === fileId) : null;
    if (!uid || !file) throw new Error("Local file not found.");
    await buildGeminiCourse(uid, file.content || file.name, fileId);
    return { data: { ok: true } };
  }
  return httpsCallable(functions, "processUploadedNotes")({ fileId });
}

export async function processRawNotes(uid, text) {
  if (!isFirebaseConfigured) {
    return buildGeminiCourse(uid, text);
  }
  return buildFirebaseGeminiCourse(uid, text);
}

export async function askTutor(messages, context) {
  if (!isFirebaseConfigured) {
    const last = messages[messages.length - 1]?.content || "";
    return callGeminiJson(
      `You are LockOn Revision's AI tutor. Be concise, helpful, and active-recall focused.
Return JSON only: {"reply":"string"}

Conversation:
${messages.map((message) => `${message.role}: ${message.content}`).join("\n")}`,
      {
      reply:
        last.length > 0
          ? `Local tutor: ${last} connects back to your uploaded lessons. Try answering it as a question first, then compare against your lesson summaries.`
          : "Local tutor ready. Ask about a topic from your notes.",
      },
    );
  }
  const result = await httpsCallable(functions, "aiTutorChat")({ messages, context });
  return result.data;
}

export async function getHint(questionId) {
  if (!isFirebaseConfigured) {
    const state = JSON.parse(localStorage.getItem("lockon-revision-local-state") || "{}");
    const uid = state.currentUserId;
    const question = uid ? state.users?.[uid]?.questions?.find((item) => item.id === questionId) : null;
    const fallback = question
      ? `Look for the option that directly matches: ${question.topic}.`
      : "Eliminate the least relevant options first.";
    const result = await callGeminiJson(
      `Return JSON only: {"hint":"one short hint that helps without revealing the answer"}
Question:
${JSON.stringify(question)}`,
      { hint: fallback },
    );
    return result.hint;
  }
  const result = await httpsCallable(functions, "generateQuestionHint")({ questionId });
  return result.data.hint;
}

export async function explainWrongAnswer(questionId, selectedAnswer) {
  if (!isFirebaseConfigured) {
    const state = JSON.parse(localStorage.getItem("lockon-revision-local-state") || "{}");
    const uid = state.currentUserId;
    const question = uid ? state.users?.[uid]?.questions?.find((item) => item.id === questionId) : null;
    const fallback = question
      ? `"${selectedAnswer}" is not the best match. The answer is "${question.correctAnswer}" because it is grounded in the uploaded lesson.`
      : "Review the lesson summary, then retry the question.";
    const result = await callGeminiJson(
      `Return JSON only: {"explanation":"brief explanation of why the selected answer is wrong and why the correct answer is right"}
Selected answer: ${selectedAnswer}
Question:
${JSON.stringify(question)}`,
      { explanation: fallback },
    );
    return result.explanation;
  }
  const result = await httpsCallable(functions, "explainWrongAnswer")({ questionId, selectedAnswer });
  return result.data.explanation;
}

export async function recordAnswer(uid, question, selectedAnswer) {
  if (!isFirebaseConfigured) {
    const isCorrect = selectedAnswer === question.correctAnswer;
    const now = new Date().toISOString();
    updateLocalUser(uid, (userData) => ({
      ...userData,
      answers: [
        {
          id: makeId("answer"),
          questionId: question.id,
          lessonId: question.lessonId,
          subjectId: question.subjectId,
          prompt: question.prompt,
          selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          answeredAt: now,
          updatedAt: now,
        },
        ...userData.answers,
      ],
      questions: userData.questions.map((item) =>
        item.id === question.id
          ? {
              ...item,
              mastery: Math.max(0, Math.min(100, Number(item.mastery || 50) + (isCorrect ? 8 : -12))),
              attempts: Number(item.attempts || 0) + 1,
              correctAttempts: Number(item.correctAttempts || 0) + (isCorrect ? 1 : 0),
              updatedAt: now,
            }
          : item,
      ),
      profile: {
        ...userData.profile,
        energy: Math.max(0, Number(userData.profile.energy || 0) - (isCorrect ? 2 : 4)),
        streak: Number(userData.profile.streak || 0) + (isCorrect ? 1 : 0),
        dailyUsage: {
          ...userData.profile.dailyUsage,
          quizzesCompleted: Number(userData.profile.dailyUsage?.quizzesCompleted || 0) + 1,
        },
      },
    }));
    return isCorrect;
  }

  const isCorrect = selectedAnswer === question.correctAnswer;
  const masteryDelta = isCorrect ? 8 : -12;

  await addDoc(collection(db, "users", uid, "answers"), {
    questionId: question.id,
    lessonId: question.lessonId,
    subjectId: question.subjectId,
    prompt: question.prompt,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect,
    answeredAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "users", uid, "questions", question.id), {
    mastery: Math.max(0, Math.min(100, Number(question.mastery || 50) + masteryDelta)),
    attempts: increment(1),
    correctAttempts: increment(isCorrect ? 1 : 0),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "users", uid), {
    energy: increment(isCorrect ? -2 : -4),
    "dailyUsage.quizzesCompleted": increment(1),
    updatedAt: serverTimestamp(),
  });

  return isCorrect;
}

export function findNextLesson(lessons = [], questions = []) {
  const weakByLesson = questions.reduce((acc, question) => {
    acc[question.lessonId] = Math.min(acc[question.lessonId] ?? 100, question.mastery ?? 50);
    return acc;
  }, {});

  return [...lessons].sort((a, b) => {
    const aScore = weakByLesson[a.id] ?? a.mastery ?? 100;
    const bScore = weakByLesson[b.id] ?? b.mastery ?? 100;
    return aScore - bScore;
  })[0];
}
