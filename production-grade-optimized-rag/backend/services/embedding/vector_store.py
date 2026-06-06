from dotenv import load_dotenv
import os
from pymongo import MongoClient

load_dotenv()


def get_collection():
    mongo_uri = os.getenv("MONGODB_URI")
    client = MongoClient(mongo_uri)
    client.admin.command("ping")
    db = client["for-rag"]
    return db["chunks"]


def store(embedded_chunks: list[dict]):
    print("store started")

    collection = get_collection()

    for i, chunk in enumerate(embedded_chunks, start=1):
        chunk["chunk_id"] = i

    result = collection.insert_many(embedded_chunks)

    print(f"Inserted {len(result.inserted_ids)} chunks")
    print("store ended")

    return True