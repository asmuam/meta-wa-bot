import fitz  # pastikan fitz (PyMuPDF) sudah diinstal
import json
import os
import re
import textwrap
import chromadb
import numpy as np
import pandas as pd

import google.generativeai as genai
from chromadb import Documents, EmbeddingFunction, Embeddings

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.tokenize import sent_tokenize

import nltk
# nltk.download('punkt')

API_KEY=os.getenv('GEMINI_API_KEY')

genai.configure(api_key=API_KEY)

class GeminiEmbeddingFunction(EmbeddingFunction):
  def __call__(self, input: Documents) -> Embeddings:
    model = 'models/embedding-001'
    title = "Custom query"
    return genai.embed_content(model=model,
                                content=input,
                                task_type="retrieval_document",
                                title=title)["embedding"]
  

def parse_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def remove_watermark(text, watermark_link):
    text = text.replace(watermark_link, '')
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_pdfs_in_directory(directory, watermark_link):
    data = []
    for filename in os.listdir(directory):
        if filename.endswith('.pdf'):
            file_path = os.path.join(directory, filename)
            pages_text = parse_pdf(file_path)
            cleaned_pages = [remove_watermark(page_text, watermark_link) for page_text in pages_text]
            combined_text = '\n\n'.join(cleaned_pages)
            data.append({
                'sumber': 'Publikasi ' + filename,
                'extractedtext': combined_text
            })
    return data

  
def create_chroma_db_from_json(json_file, name):
    # Baca data dari file JSON
    with open(json_file, 'r', encoding='utf-8') as file:
        documents = json.load(file)
    
    # Buat instance dari Chroma client
    chroma_client = chromadb.Client()

    
    # Cek apakah koleksi sudah ada
    db = chroma_client.get_or_create_collection(name=name, embedding_function=GeminiEmbeddingFunction())
    # Ekstrak teks dan metadata dari dokumen
    texts = [doc['extractedtext'] for doc in documents]
    metadata = [{'sumber': doc['sumber']} for doc in documents]
        
    # Tambahkan dokumen ke dalam vector database
    for i, text in enumerate(texts):
      db.add(
          documents=[text],
          ids=[str(i)],
          metadatas=[metadata[i]]
            )
    
    return db

def create_chroma_db(documents, name):
    chroma_client = chromadb.Client()
    db = chroma_client.create_collection(name=name, embedding_function=GeminiEmbeddingFunction())
    texts = [doc['extractedtext'] for doc in documents]
    metadata = [{'sumber': doc['sumber']} for doc in documents]
    for i, text in enumerate(texts):
        embedding = GeminiEmbeddingFunction()(input=[text])
        db.add(
            documents=[text],
            ids=[str(i)],
            embeddings=embedding,
            metadatas=[metadata[i]]
        )
    return db

def get_relevant_passage(query, db):
    results = db.query(query_texts=[query], n_results=1)
    if results['documents']:
        document_id = results['documents'][0][0]  # ID dokumen
        metadata = results['metadatas'][0][0]    # Metadata untuk dokumen yang relevan
        passage = results['documents'][0][0]     # Passage relevan
        
        return {
            'passage': passage,
            'metadata': metadata,
            'document_id': document_id
        }
    return None

def extract_sentences(text):
    return sent_tokenize(text)

def find_relevant_sentences(query, sentences):
    vectorizer = TfidfVectorizer()
    sentence_vectors = vectorizer.fit_transform(sentences)
    query_vector = vectorizer.transform([query])
    similarities = cosine_similarity(query_vector, sentence_vectors).flatten()
    return similarities

def get_contextual_sentences(sentences, similarities, top_n=7, context_size=7):
    top_indices = similarities.argsort()[-top_n:][::-1]
    result = []
    for idx in top_indices:
        start = max(0, idx - context_size)
        end = min(len(sentences), idx + context_size + 1)
        context = sentences[start:end]
        result.append({
            'sentence': sentences[idx],
            'context': context
        })
    return result

def make_prompt(query, contextual_sentences, metadata):
    source_info = metadata.get('sumber', 'Unknown source')
    formatted_sentences = ""
    for entry in contextual_sentences:
        context_text = ' '.join(entry['context'])
        formatted_sentences += f"Sentence: {entry['sentence']}\nContext: {context_text}\n\n"
    
    prompt = ("""Anda adalah seorang perwakilan yang berpengetahuan dan membantu dari Badan Pusat Statistik (BPS)
    Kabupaten Boyolali yang memberikan data dan informasi kepada pengguna terutama terkait statistik khusunya statistik 
    boyolali. Tujuan Anda adalah untuk menjawab pertanyaan menggunakan data yang kamu miliki di bawah ini. INGAT! data dibawah merupakan data yang kamu miliki bukan data yang saya berikan ke kamu. 
    Pastikan jawaban Anda komprehensif, mudah dipahami, dan menghindari jargon teknis sebisa mungkin. 
    Gunakan nada yang ramah dan pecahkan konsep-konsep yang kompleks menjadi informasi yang 
    sederhana dan mudah dicerna. Gunakan referensi data yang kamu miliki sebagai alat bantu selain pengetahuanmu sendiri!. 
    Jika data yang kamu miliki dibawah tidak mengandung informasi yang relevan untuk jawaban, Anda boleh mengabaikannya dan menjawab sesuai pengetahuannmu. 
    sebisa mungkin format jawaban sebagai berikut 1. salam pembuka singkat 2. sumber data (asal datanya) jika merupakan 
    angka/metode/hasil analisis atau yang terkait dengan hasil statistik, jika bukan maka cukup jawab langsung saja. jangan bilang bahwa data tambahan ini dari saya, ini adalah data kamu!.
    berikut pertanyaan dan referensi bantuan yg mungkin dibutuhkan.
    PERTANYAAN: '{query}'
    data tambahan:
    {formatted_sentences}
    sumber data: '{source_info}'
    ANSWER:
    """).format(query=query, formatted_sentences=formatted_sentences, source_info=source_info)

    return prompt

def main():
    # directory = './pdfs'  # Directory containing PDF files
    # watermark_link = 'https://boyolalikab.bps.go.id'  # Link yang ingin dihapus
    # documents = parse_pdfs_in_directory(directory, watermark_link)
    # with open('parsed_data.json', 'w') as json_file:
    #     json.dump(documents, json_file, indent=4) 
    
    json_file = 'parsed_data_v1.json'  # Nama file JSON yang sudah ada
    db = create_chroma_db_from_json(json_file, "data_pdf")
    query = "siapa kepala sub bagian umum kabupaten boyolali?"
    result = get_relevant_passage(query, db)
    

        
    if result:
        document_id = result['document_id']
        passage = result['passage']
        metadata = result['metadata']
        print("PASSAGE")
        print(passage)
        print("======================================================")
        # Extract sentences from the passage
        sentences = extract_sentences(passage)
        
        # Find relevant sentences
        similarities = find_relevant_sentences(query, sentences)
        contextual_sentences = get_contextual_sentences(sentences, similarities)
        
        prompt = make_prompt(query, contextual_sentences, metadata)
        model = genai.GenerativeModel('gemini-1.5-flash')
        answer = model.generate_content(prompt)
        print(answer)
    else:
        print("No relevant passage found.")

if __name__ == "__main__":
    main()