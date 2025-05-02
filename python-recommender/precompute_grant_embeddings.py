# MONGO_URI = "mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/"
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import json

# 🔹 1. Connect to MongoDB
client = MongoClient("mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/")  # Replace with your Mongo URI if needed
db = client["Grants"]  # Replace with your DB name
grants_collection = db["allGrants"]  # Replace with your collection

# 🔹 2. Load the SentenceTransformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# 🔹 3. Fetch grants
grants = list(grants_collection.find())

# 🔹 4. Prepare data and compute embeddings
precomputed = []
for grant in grants:
    grant_text = f"{grant.get('title', '')} {grant.get('description', '')} {grant.get('scope', '')}".strip()
    apply_text = (grant.get("who_can_apply") or "").strip()

    title_embedding = model.encode(grant.get("title", ""), normalize_embeddings=True).tolist()
    grant_embedding = model.encode(grant_text, normalize_embeddings=True).tolist()
    apply_embedding = model.encode(apply_text, normalize_embeddings=True).tolist()

    # Keep original fields + embeddings
    grant_data = {
        "title": grant.get("title", ""),
        "description": grant.get("description", ""),
        "scope": grant.get("scope", ""),
        "opening_date": grant.get("opening_date", ""),
        "closing_date": grant.get("closing_date", ""),
        "who_can_apply": grant.get("who_can_apply", ""),
        "link": grant.get("link", ""),
        "total_fund": grant.get("total_fund", ""),
        "contact_email": grant.get("contact_email", ""),
        "opportunity_status": grant.get("opportunity_status", ""),
        "grant_embedding": grant_embedding,
        "apply_embedding": apply_embedding,
        "title_embedding": title_embedding
    }

    precomputed.append(grant_data)

# 🔹 5. Save to JSON
with open("grants_with_embeddings.json", "w") as f:
    json.dump(precomputed, f)

print(f"✅ Saved {len(precomputed)} grants with embeddings.")
