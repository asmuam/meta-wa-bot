// gemini.js
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Function to handle Gemini response
export async function handleGeminiResponse(userPrompt) {
  const { GEMINI_API_KEY } = process.env;
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    return "Configuration error: GEMINI_API_KEY is not set.";
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  // Manually create a fetch function for the generative model
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });

  // Only include text in the contents
  let contents = [
    {
      role: 'user',
      parts: [
        { text: userPrompt }
      ]
    }
  ];


  let geminiResponse = "";

  try {
    const result = await model.generateContent(userPrompt);
    geminiResponse = result.response.text();
    return `${geminiResponse}\n\nDisclaimer: Jawaban ini dihasilkan oleh AI Gemini.`;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
  }
}