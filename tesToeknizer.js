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
const data = JSON.parse(fs.readFileSync('./data.js', 'utf8'));

// Process each document and generate the result
const passage = data.map(doc => {
    const { sumber, extractedtext } = doc;
    const sentences = findSentencesWithKeyword(extractedtext, "berapa konsumsi per kapita di boyolali?");
    return `sumber = ${sumber}\npassage= ${sentences.join('\n')}\n`;
}).join('');

console.log(passage);

