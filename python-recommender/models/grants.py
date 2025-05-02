import json
import torch
import os
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer, util

# Load the model once
model = SentenceTransformer("all-MiniLM-L6-v2")

current_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(current_dir, "grants_with_embeddings.json")
print(f"Looking for grants_with_embeddings.json at: {json_path}")

# Load precomputed grants once
with open(json_path, "r") as f:
    precomputed_grants = json.load(f)


router = APIRouter()
model = SentenceTransformer('all-MiniLM-L6-v2')

class Grant(BaseModel):
    title: str
    description: Optional[str] = ""
    scope: Optional[str] = ""
    opening_date: str = ""
    closing_date: str = ""
    who_can_apply: str = ""

class Publication(BaseModel):
    title: str
    journal: str
    year: str
    authors: List[str]
    keywords: List[str]
    abstract: Optional[str] = ""

class RecommendRequest(BaseModel):
    user_interests: List[str]
    educationLevel: Optional[str] = ""  # Changed from education_level
    currentAffiliation: Optional[str] = ""  # Changed from affiliation
    publications: Optional[List[Publication]] = []
    fetched_publications: Optional[List[Publication]] = []
    grants: List[Grant]

@router.post("/recommend/grants")
def recommend_grants(data: RecommendRequest, top_n: int = Query(10)):
    all_publications = (data.publications or []) + (data.fetched_publications or [])
    publication_text = " ".join([
        f"{pub.title} {' '.join(pub.keywords)} {pub.abstract or ''}" for pub in all_publications
    ])
    
    interest_text = " ".join(data.user_interests)
    qualification_text = f"{data.educationLevel or ''} {data.currentAffiliation or ''}".strip()

    # Batch encode user data
    user_embeddings = model.encode(
        [interest_text, qualification_text, publication_text],
        convert_to_tensor=True, normalize_embeddings=True
    )
    interest_embedding, qualification_embedding, publication_embedding = user_embeddings

    interest_based = []
    publication_based = []
    qualification_based = []

    for grant in precomputed_grants:
        grant_embedding = torch.tensor(grant["grant_embedding"])
        apply_embedding = torch.tensor(grant["apply_embedding"])
        title_embedding = torch.tensor(grant["title_embedding"])

        interest_score = float(util.cos_sim(interest_embedding, title_embedding)[0])
        qualification_score = float(util.cos_sim(qualification_embedding, apply_embedding)[0])
        publication_score = float(util.cos_sim(publication_embedding, grant_embedding)[0])

        base_grant_info = {
            "title": grant["title"],
            "description": grant["description"],
            "scope": grant["scope"],
            "opening_date": grant.get("opening_date", ""),
            "closing_date": grant.get("closing_date", ""),
            "who_can_apply": grant.get("who_can_apply", ""),
            "link": grant.get("link", ""),
            "total_fund": grant.get("total_fund", ""),
            "contact_email": grant.get("contact_email", ""),
            "opportunity_status": grant.get("opportunity_status", "")
        }

        if interest_score > 0.3:
            interest_based.append({
                "reason": "Based on your research interests",
                "grant": base_grant_info,
                "score": interest_score
            })

        if publication_score > 0.3:
            publication_based.append({
                "reason": "Based on your publication history",
                "grant": base_grant_info,
                "score": publication_score
            })

        if qualification_score > 0.3:
            qualification_based.append({
                "reason": "Based on your qualifications",
                "grant": base_grant_info,
                "score": qualification_score
            })

    # Sort each list by descending score and limit to top N
    interest_based.sort(key=lambda x: x["score"], reverse=True)
    publication_based.sort(key=lambda x: x["score"], reverse=True)
    qualification_based.sort(key=lambda x: x["score"], reverse=True)

    return {
        "recommended_by_interest": interest_based[:top_n],
        "recommended_by_publications": publication_based[:top_n],
        "recommended_by_qualification": qualification_based[:top_n]
    }
