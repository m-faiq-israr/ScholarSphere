import json
import pymongo
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

client = pymongo.MongoClient("mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/")
db = client["Conferences"]
collection = db["allConferences"]

conference_data = []
for conf in collection.find():
    title = conf.get("title", "")
    topics_str = conf.get("topics", "")
    topics_list = [t.strip() for t in topics_str.split(",")] if topics_str else []

    combined_text = f"{title} {' '.join(topics_list)}"
    embedding = model.encode(combined_text, normalize_embeddings=True).tolist()

    conference_data.append({
        "_id": str(conf["_id"]),
        "title": title,
        "topics": topics_str,  # Store original string
        "start_date": conf.get("start_date", ""),
        "end_date": conf.get("end_date", ""),
        "location": conf.get("location", ""),
        "link": conf.get("link", ""),
        "conference_embedding": embedding
    })

with open("conferences_with_embeddings.json", "w", encoding="utf-8") as f:
    json.dump(conference_data, f, indent=2)

print("✅ Saved embeddings to conferences_with_embeddings.json")
