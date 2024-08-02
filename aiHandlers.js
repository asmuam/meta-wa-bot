// gemini.js
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import fs from 'fs';
import natural from 'natural';

/**
 * Filter out short words from a string.
 * @param {string} str - The string to process.
 * @param {number} minLength - The minimum length of words to keep.
 * @returns {string} - The string with short words removed.
 */
function filterShortWords(str, minLength) {
  return str
      .split(' ')
      .filter(word => word.length > minLength)
      .join(' ');
}

/**
* Find sentences containing specific keywords or phrases along with contextual sentences.
* @param {string} text - The text to search within.
* @param {string} phrase - The keyword or phrase to search for.
* @returns {string[]} - An array of sentences with the keyword-containing sentence appropriately positioned.
*/
function findSentencesWithKeyword(text, phrase) {
  // Filter out short words from the phrase
  const filteredPhrase = filterShortWords(phrase, 2);
  
  if (!filteredPhrase) {
      return [];
  }

  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(text);
  const tfidf = new natural.TfIdf();

  // Filter out short words from each sentence before adding to TfIdf instance
  sentences.forEach(sentence => {
      const filteredSentence = filterShortWords(sentence, 2);
      tfidf.addDocument(filteredSentence);
  });

  const results = [];
  let contextStartIndex = null;
  let contextEndIndex = null;
  let currentContext = [];

  // Calculate the TfIdf measure for each sentence
  tfidf.tfidfs(filteredPhrase, (i, measure) => {
      if (measure > 0) {
          if (contextStartIndex === null) {
              contextStartIndex = Math.max(0, i - 1);
          }
          contextEndIndex = Math.min(sentences.length - 1, i + 1);

          // Check if the next sentence also contains the phrase to extend the context
          if (i < sentences.length - 1 && tfidf.tfidf(filteredPhrase, i + 1) > 0) {
              return;
          }

          // Collect the context sentences
          currentContext.push(...sentences.slice(contextStartIndex, contextEndIndex + 1));

          // Filter duplicates and maintain order
          currentContext = Array.from(new Set(currentContext));

          // Add current context to results
          results.push(currentContext.join(' '));

          // Reset for the next context
          contextStartIndex = null;
          contextEndIndex = null;
          currentContext = [];
      }
  });

  return results;
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
   angka/metode/hasil analisis atau yang terkait dengan hasil statistik, jika bukan cukup jawab langsung saja. jangan bilang bahwa data tambahan ini dari penanya. data tambahan tsb adalah data anda sendiri.
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