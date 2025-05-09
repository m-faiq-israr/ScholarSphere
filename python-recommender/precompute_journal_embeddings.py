import json
from sentence_transformers import SentenceTransformer
from pymongo import MongoClient

model = SentenceTransformer("all-MiniLM-L6-v2")

client = MongoClient("mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/")
db = client["Journals"]
collection = db["allJournals"]

journals = list(collection.find())

journal_texts = [
    f"{j.get('title', '')} {j.get('scope', '')} {' '.join(j.get('subject_areas', []))}"
    for j in journals
]

embeddings = model.encode(journal_texts, convert_to_numpy=True).tolist()
journal_ids = [str(j["_id"]) for j in journals]

with open("journals_with_embeddings.json", "w") as f:
    json.dump({
        "ids": journal_ids,
        "embeddings": embeddings
    }, f)

print(f"Saved {len(embeddings)} embeddings with journal IDs.")
