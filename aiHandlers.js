// gemini.js
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { sourcePDF } from "./pdf.js";
import nlp from 'compromise';
import natural from 'natural';
import fs from 'fs';

const tokenizer = new natural.SentenceTokenizer();

/**
 * Find sentences containing specific keywords or phrases along with contextual sentences.
 * @param {string} text - The text to search within.
 * @param {string} phrase - The keyword or phrase to search for.
 * @returns {string[]} - An array of sentences with the keyword-containing sentence appropriately positioned.
 */
function findSentencesWithKeyword(text, phrase) {
  // Tokenisasi teks menjadi kalimat
  const sentences = tokenizer.tokenize(text);

  // Tokenisasi frasa menjadi kata-kata
  const keywords = phrase.toLowerCase().split(' ');
  const keywordSet = new Set(keywords); // Untuk mencegah kata duplikat

  // Temukan kalimat yang mengandung kata kunci dan hitung kemiripan
  const sentenceMatches = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/);
    const matchCount = sentenceWords.filter(word => keywordSet.has(word)).length;
    return { index, sentence, matchCount };
  });

  // Urutkan kalimat berdasarkan jumlah kecocokan, dari yang tertinggi ke terendah
  sentenceMatches.sort((a, b) => b.matchCount - a.matchCount);

  // Ambil 20 kalimat teratas
  const topMatches = sentenceMatches.slice(0, 21);

  // Menentukan jumlah kalimat kontekstual untuk disertakan
  const contextRange = 11;

  // Menentukan indeks kalimat yang relevan
  const relevantIndices = new Set(topMatches.map(match => match.index));

  // Mengumpulkan kalimat kontekstual di sekitar kalimat yang relevan
  const resultSet = new Set();
  topMatches.forEach(({ index }) => {
    const start = Math.max(index - contextRange, 0);
    const end = Math.min(index + contextRange + 1, sentences.length);
    for (let i = start; i < end; i++) {
      resultSet.add(i);
    }
  });

  // Mengurutkan hasil berdasarkan urutan kemunculan asli dan menghapus duplikat
  const result = Array.from(resultSet)
    .sort((a, b) => a - b)
    .map(i => sentences[i])
    .filter((item, pos, self) => self.indexOf(item) === pos); // Hapus duplikat

  return result;
}

// Load JSON data from file
const data = JSON.parse(fs.readFileSync('./data.js', 'utf8'));


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

  // Process each document and generate the result
  const passage = data.map(doc => {
    const { sumber, extractedtext } = doc;
    const sentences = findSentencesWithKeyword(extractedtext, userPrompt);
    return `sumber = ${sumber}\npassage= ${sentences.join('\n')}\n`;
  }).join('');

  console.log(passage);

  // Create a prompt
  const prompt = `Anda adalah seorang perwakilan yang berpengetahuan dan membantu dari Badan Pusat Statistik (BPS)
   Kabupaten Boyolali yang memberikan data dan informasi kepada pengguna terutama terkait statistik khusunya statistik 
   boyolali. Tujuan Anda adalah untuk menjawab pertanyaan menggunakan bantuan teks dari data referensi di bawah ini. 
   Pastikan jawaban Anda komprehensif, mudah dipahami, dan menghindari jargon teknis sebisa mungkin. 
   Gunakan nada yang ramah dan percakapan, dan pecahkan konsep-konsep yang kompleks menjadi informasi yang 
   sederhana dan mudah dicerna. Gunakan referensi data dibawah sebagai alat bantu selain pengetahuanmu sendiri!. 
   Jika data tersebut tidak mengandung informasi yang relevan untuk jawaban, Anda boleh mengabaikannya dan menjawab sesuai pengetahuannmu. 
   sebisa mungkin format jawaban sebagai berikut 1. salam pembuka singkat 2.sumber data jika merupakan 
   angka/metode/hasil analisis atau yang terkait dengan hasil statistik, jika bukan cukup jawab langsung saja.
    berikut pertanyaan dan referensi bantuan yg mungkin dibutuhkan.\n\nPERTANYAAN: '${userPrompt}'\data tambahan: '${passage}'\n\nJAWABAN:`;

  let geminiResponse = "";

  try {
    const result = await model.generateContent(prompt);
    geminiResponse = result.response.text();
    return `${geminiResponse}\n*Disclaimer*: Jawaban ini dihasilkan oleh AI Gemini sehingga terdapat kemungkinan untuk salah.\nKunjungi https://boyolalikab.bps.go.id/ untuk mencari informasi yang lebih tepat \n\nKetik *0* untuk kembali ke menu awal.`;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
  }
}