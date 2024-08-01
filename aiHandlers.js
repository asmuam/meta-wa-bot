// gemini.js
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { sourcePDF } from "./pdf.js";
import nlp from 'compromise';

/**
 * Find sentences containing specific keywords or phrases along with contextual sentences.
 * @param {string} text - The text to search within.
 * @param {string} phrase - The keyword or phrase to search for.
 * @returns {string[]} - An array of sentences with the keyword-containing sentence appropriately positioned.
 */
function findSentencesWithKeyword(text, phrase) {
  // Use compromise to process the text and split into sentences
  const doc = nlp(text);
  const sentences = doc.sentences().out('array');

  // Prepare keywords and phrases for search
  const keywords = phrase.toLowerCase().split(' ');
  const keywordSet = new Set(keywords); // To prevent duplicate words

  // Find the index of the sentence containing the most keywords
  let maxKeywordCount = 0;
  let keywordIndex = -1;

  sentences.forEach((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().split(' ');
    const matchCount = sentenceWords.filter(word => keywordSet.has(word)).length;
    if (matchCount > maxKeywordCount) {
      maxKeywordCount = matchCount;
      keywordIndex = index;
    }
  });

  // If no keywords are found, return an empty array
  if (keywordIndex === -1) return [];

  // Determine the number of contextual sentences to include based on the number of keywords
  let contextRange = 2; // Default context range for multi-word phrases
  if (keywords.length === 1) {
    contextRange = 0; // No context for single-word keyword
  } else if (keywords.length === 2) {
    contextRange = 2; // Include 2 sentences on either side for two-word phrases
  }

  // Determine the start and end indices to get the context
  const start = Math.max(keywordIndex - contextRange, 0);
  const end = Math.min(keywordIndex + contextRange + 1, sentences.length);

  // Extract the sentences around the keyword-containing sentence
  const result = sentences.slice(start, end);

  return result;
}

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

  const passage = findSentencesWithKeyword(sourcePDF, userPrompt);
  console.log(passage);

  // Create a prompt
  const prompt = `Anda adalah seorang perwakilan yang berpengetahuan dan membantu dari Badan Pusat Statistik (BPS) yang memberikan data dan informasi kepada pengguna. Tujuan Anda adalah untuk menjawab pertanyaan menggunakan teks dari kutipan referensi di bawah ini. Pastikan jawaban Anda komprehensif, mudah dipahami, dan menghindari jargon teknis sebisa mungkin. Gunakan nada yang ramah dan percakapan, dan pecahkan konsep-konsep yang kompleks menjadi informasi yang sederhana dan mudah dicerna. Gunakan hanya kutipan referensi yang diberikan untuk jawaban Anda!. Jika kutipan tersebut tidak mengandung informasi yang relevan untuk jawaban, Anda boleh mengabaikannya. dan perlu diingat tidak perlu bertele-tele. langsung saja ke jawaban dari pertanyaannya\n\nPERTANYAAN: '${userPrompt}'\nKUTIPAN: '${passage}'\n\nJAWABAN:`;

  let geminiResponse = "";

  try {
    const result = await model.generateContent(prompt);
    geminiResponse = result.response.text();
    return `${geminiResponse}\n*Disclaimer*: Jawaban ini dihasilkan oleh AI Gemini.\n\nKetik *0* untuk kembali ke menu awal.`;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
  }
}