import json
import requests
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("JINA_API_KEY")

url = "https://api.jina.ai/v1/embeddings"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}


def embedQuery(query):
    print('query embedder started')

    data = {
        "model": "jina-embeddings-v5-text-small",
        "task": "retrieval.query",
        "normalized": True,
        "input": query
    }

    response = requests.post(
        url,
        headers=headers,
        data=json.dumps(data)
    )

    response.raise_for_status()         # autom. throws exeption during requesting
    result = response.json()['data'][0]['embedding']
    
    
    print('query embedder ended')
    return result