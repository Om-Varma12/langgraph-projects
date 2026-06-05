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


def embedd(chunks: list[str]) -> list[dict]:
    print('chunk embedder started')

    data = {
        "model": "jina-embeddings-v5-text-small",
        "task": "retrieval.query",
        "normalized": True,
        "input": chunks
    }

    response = requests.post(
        url,
        headers=headers,
        data=json.dumps(data)
    )

    response.raise_for_status()         # autom. throws exeption during requesting
    result = response.json()
    output = []

    for item in result["data"]:
        output.append(
            {
                "text": chunks[item["index"]],
                "embedding": item["embedding"]
            }
        )

    print('chunk embedder ended')
    
    return output