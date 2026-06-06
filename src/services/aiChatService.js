import { callGeminiJson } from "./geminiService.js";
import { getForgeContext } from "./forgeService.js";

function summarizeForgeStructure(subjects) {
  if (!subjects?.length) return "No Forge subjects have been generated yet.";

  return subjects
    .map((subject) => {
      const units = (subject.units || [])
        .map((unit) => {
          const subUnits = (unit.subUnits || [])
            .map((subUnit) => {
              const lessons = (subUnit.lessons || []).map((lesson) => `- ${lesson.title}: ${lesson.summary || ""}`).join("\n");
              return `  Sub Unit: ${subUnit.title}\n${lessons}`;
            })
            .join("\n");
          return `Unit: ${unit.title}\n${subUnits}`;
        })
        .join("\n");
      return `Subject: ${subject.title}\n${units}`;
    })
    .join("\n\n");
}

export async function askForgeAssistant(uid, messages) {
  const { subjects, sourceText } = await getForgeContext(uid);
  const structureSummary = summarizeForgeStructure(subjects);
  const conversation = messages
    .map((message) => `${message.role === "user" ? "Student" : "Assistant"}: ${message.content}`)
    .join("\n");

  const prompt = `You are LockOn Revision's AI study assistant.
Answer using the student's uploaded study material and generated Forge learning structure whenever possible.
Be concise, encouraging, and focused on active recall.

Generated learning structure:
${structureSummary}

Uploaded study material (excerpt):
${sourceText.slice(0, 80000) || "No source text stored yet."}

Conversation:
${conversation}

Return strict JSON only: {"reply":"your response here"}`;

  const fallback = {
    reply: subjects.length
      ? "I can help you revise your Forge subjects. Ask about a specific unit, sub-unit, or lesson."
      : "Upload notes in Forge first so I can answer with your study material context.",
  };

  return callGeminiJson(prompt, fallback);
}
