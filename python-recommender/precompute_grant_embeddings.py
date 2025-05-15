from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import json

client = MongoClient("mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/") 
db = client["Grants"] 
grants_collection = db["allGrants"]  

model = SentenceTransformer("all-MiniLM-L6-v2")

grants = list(grants_collection.find())

precomputed = []
for grant in grants:
    grant_text = f"{grant.get('title', '')} {grant.get('description', '')} {grant.get('scope', '')}".strip()
    apply_text = (grant.get("who_can_apply") or "").strip()

    title_embedding = model.encode(grant.get("title", ""), normalize_embeddings=True).tolist()
    grant_embedding = model.encode(grant_text, normalize_embeddings=True).tolist()
    apply_embedding = model.encode(apply_text, normalize_embeddings=True).tolist()

    grant_data = {
        "_id": str(grant["_id"]),
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

with open("grants_with_embeddings.json", "w") as f:
    json.dump(precomputed, f)

print(f"✅ Saved {len(precomputed)} grants with embeddings.")
