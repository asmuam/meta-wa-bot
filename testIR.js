import fs from 'fs';
import natural from 'natural';
// Function to filter out short words and handle punctuation
function filterShortWords(str, minLength) {
    return str
      .split(/\s+/)  // Split by any whitespace
      .map(word => word.replace(/[.,!?;()]/g, ''))  // Remove punctuation
      .filter(word => word.length > minLength)
      .join(' ');
  }
  
  // Function to calculate TF-IDF for each document based on userPrompt
  function calculateTfIdf(data, userPrompt, nDoc, tfidfThreshold = 0.1) {
    const filteredPrompt = filterShortWords(userPrompt, 1);
    if (!filteredPrompt) return [];
  
    const tfidf = new natural.TfIdf();
    
    data.forEach(doc => {
      const filteredText = filterShortWords(doc.extractedtext, 2);
      tfidf.addDocument(filteredText);
    });
  
    const tfidfValues = [];
    tfidf.tfidfs(filteredPrompt, (i, measure) => {
      tfidfValues.push({ index: i, measure });
    });
  
    // Sort by measure in descending order and filter by tfidfThreshold
    const topDocumentIndices = tfidfValues
      .sort((a, b) => b.measure - a.measure)
      .filter(doc => doc.measure >= tfidfThreshold)
      .slice(0, nDoc)
      .map(doc => doc.index);
  
    // Retrieve top documents based on indices
    const topDocuments = topDocumentIndices.map(index => data[index]);
  
    return topDocuments;
  }
  
  // Function to find top n_sentence sentences with keyword using TF-IDF within top documents
  function findTopSentencesWithKeywordInTopDocuments(topDocuments, phrase, nSentence, contextSize, tfidfThreshold) {
    const filteredPhrase = filterShortWords(phrase, 1);
    if (!filteredPhrase) return [];
  
    const tokenizer = new natural.SentenceTokenizer();
    const tfidf = new natural.TfIdf();
    let sentencesMap = {};
  
    topDocuments.forEach((doc, docIndex) => {
      const sentences = tokenizer.tokenize(doc.extractedtext);
      sentencesMap[docIndex] = sentences;
      sentences.forEach(sentence => {
        const filteredSentence = filterShortWords(sentence, 2);
        tfidf.addDocument(filteredSentence);
      });
    });
  
    const sentenceScores = [];
    tfidf.tfidfs(filteredPhrase, (i, measure) => {
      if (measure >= tfidfThreshold) {
        const docIndex = Math.floor(i / Object.values(sentencesMap).reduce((acc, arr) => acc + arr.length, 0) * topDocuments.length);
        const sentenceIndex = i % sentencesMap[docIndex].length;
        sentenceScores.push({ docIndex, sentenceIndex, measure });
      }
    });
  
    // Sort by measure in descending order and get top nSentence sentences
    const topSentences = sentenceScores.sort((a, b) => b.measure - a.measure).slice(0, nSentence);
  
    const results = [];
    topSentences.forEach(({ docIndex, sentenceIndex }) => {
      const contextSentences = sentencesMap[docIndex].slice(Math.max(0, sentenceIndex - contextSize), Math.min(sentencesMap[docIndex].length, sentenceIndex + contextSize + 1));
      results.push({
        docIndex,
        context: contextSentences.join(' ')
      });
    });
  
    // Deduplicate results
    const uniqueResults = Array.from(new Set(results.map(res => res.context)))
      .map(context => results.find(res => res.context === context));
  
    return uniqueResults.map(result => result.context);
  }
  
  // Process each document and generate the result
  function processDocuments(data, userPrompt, nDoc, nSentence, contextSize, tfidfThreshold) {
    const topDocuments = calculateTfIdf(data, userPrompt, nDoc, tfidfThreshold);
    const sentences = findTopSentencesWithKeywordInTopDocuments(topDocuments, userPrompt, nSentence, contextSize, tfidfThreshold);
    
    return topDocuments.map(doc => {
      const { sumber } = doc;
      return `sumber = ${sumber}\npassage = ${sentences.join('\n')}\n`;
    }).join('');
  }
  
  // Load JSON data from file
  const data = JSON.parse(fs.readFileSync('./parsed_data_v1.json', 'utf8'));
  
  const userPrompt = "jumlah rumah tangga usaha pertanian di boyolali?";  // Example user prompt
  const nDoc = 5;  // Example: top n documents
  const nSentence = 23;  // Example: top n sentences per document
  const contextSize = 3;  // Example: n sentence before and after the main sentence
  const tfidfThreshold = 0;  // Example: TF-IDF threshold of n
  
  const passage = processDocuments(data, userPrompt, nDoc, nSentence, contextSize, tfidfThreshold);
  console.log(passage);