// gemini.js
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Function to extract relevant content from the PDF text
function extractRelevantContent(passage, userPrompt) {
  // Define keywords to search for based on the user prompt
  const keywords = userPrompt.split(' '); // Split prompt into words to use as keywords
  const lowerCasePassage = passage.toLowerCase();
  
  // Search for keywords in the passage
  let relevantContent = "";
  keywords.forEach(keyword => {
    if (lowerCasePassage.includes(keyword.toLowerCase())) {
      // Find the sentence containing the keyword
      const regex = new RegExp(`[^.?!]*${keyword}[^.?!]*[.?!]`, 'gi');
      const matches = lowerCasePassage.match(regex);
      if (matches) {
        relevantContent += matches.join(' ') + ' ';
      }
    }
  });

  // If no relevant content found, use the first few sentences as a fallback
  if (!relevantContent) {
    const sentences = passage.split(/[.?!]/).slice(0, 5).join('. ') + '.';
    relevantContent = sentences;
  }

  return relevantContent.trim();
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


  const passage = extractRelevantContent(sourcePDF, userPrompt);
  ; // pakai embednya

  // Create a prompt
  const prompt = `Anda adalah seorang perwakilan yang berpengetahuan dan membantu dari Badan Pusat Statistik (BPS) yang memberikan data dan informasi kepada pengguna. Tujuan Anda adalah untuk menjawab pertanyaan menggunakan teks dari kutipan referensi di bawah ini. Pastikan jawaban Anda komprehensif, mudah dipahami, dan menghindari jargon teknis sebisa mungkin. Gunakan nada yang ramah dan percakapan, dan pecahkan konsep-konsep yang kompleks menjadi informasi yang sederhana dan mudah dicerna. Gunakan hanya kutipan referensi yang diberikan untuk jawaban Anda. Jika kutipan tersebut tidak mengandung informasi yang relevan untuk jawaban, Anda boleh mengabaikannya.\n\nPERTANYAAN: '${userPrompt}'\nKUTIPAN: '${passage}'\n\nJAWABAN:`;


  // Only include text in the contents
  let contents = [
    {
      role: 'user',
      parts: [
        { text: prompt }
      ]
    }
  ];


  let geminiResponse = "";

  try {
    const result = await model.generateContent(userPrompt);
    geminiResponse = result.response.text();
    return `${geminiResponse}\n*Disclaimer*: Jawaban ini dihasilkan oleh AI Gemini.\n\nKetik *0* untuk kembali ke menu awal.`;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
  }
}