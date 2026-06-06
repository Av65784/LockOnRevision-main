const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const geminiModel = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

export function hasGeminiKey() {
  return Boolean(geminiApiKey);
}

export function getGeminiModel() {
  return geminiModel;
}

function parseGeminiJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

export async function callGeminiJson(prompt, fallbackValue = null) {
  if (!hasGeminiKey()) {
    if (fallbackValue !== null) return fallbackValue;
    throw new Error("Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your environment.");
  }

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

  if (!response.ok) {
    const message = `Gemini request failed: ${response.status}`;
    if (fallbackValue !== null) {
      console.warn(message);
      return fallbackValue;
    }
    throw new Error(message);
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    if (fallbackValue !== null) return fallbackValue;
    throw new Error("Gemini returned no text.");
  }

  try {
    return parseGeminiJson(text);
  } catch (error) {
    if (fallbackValue !== null) {
      console.warn(error);
      return fallbackValue;
    }
    throw new Error("Gemini returned invalid JSON.");
  }
}

export async function callGeminiText(prompt, fallbackText = "") {
  if (!hasGeminiKey()) {
    if (fallbackText) return fallbackText;
    throw new Error("Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your environment.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 },
      }),
    },
  );

  if (!response.ok) {
    if (fallbackText) return fallbackText;
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    if (fallbackText) return fallbackText;
    throw new Error("Gemini returned no text.");
  }
  return text;
}
