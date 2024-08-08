from flask import Flask, request, jsonify
import json
import os
import logging
from parserPDF import create_chroma_db_from_json, get_relevant_passage, make_prompt, genai

app = Flask(__name__)

# Inisialisasi database saat server dimulai
json_file = 'parsed_data_v1.json'
db = create_chroma_db_from_json(json_file, "data_pdf")

@app.route("/get_prompt", methods=["POST"])
def get_answer():    
    try:
        data = request.json
        query = data.get('query', '')  # Ambil query dari JSON, default ke string kosong jika tidak ada

        # Dapatkan passage relevan
        result = get_relevant_passage(query, db)

        if result:
            passages = result['passage']
            metadata = result['metadata']
            prompt = make_prompt(query, passages, metadata)

            return ({'prompt': prompt})
        else:
            return ({'answer': "No relevant passage found."})
    except Exception as e:
        app.logger.error("Exception occurred: %s", str(e))
        return ({'answer': "Error processing request."})

if __name__ == "__main__":
    host = '0.0.0.0'
    port = 5000
    app.run(host=host, port=port, debug=True)
    json_file = 'parsed_data_v1.json'
    db = create_chroma_db_from_json(json_file, "data_pdf")