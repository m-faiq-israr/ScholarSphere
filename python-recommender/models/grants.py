import json
import torch
import os
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

current_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(current_dir, "grants_with_embeddings.json")
print(f"Looking for grants_with_embeddings.json at: {json_path}")

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
    educationLevel: Optional[str] = "" 
    currentAffiliation: Optional[str] = ""  
    publications: Optional[List[Publication]] = []
    fetched_publications: Optional[List[Publication]] = []
    grants: List[Grant]

@router.post("/recommend/grants")
def recommend_grants(data: RecommendRequest, top_n: int = Query(10)):
    all_publications = (data.publications or []) + (data.fetched_publications or [])
    interest_text = " ".join(data.user_interests) if data.user_interests else None
    qualification_text = f"{data.educationLevel} {data.currentAffiliation}".strip() if data.educationLevel or data.currentAffiliation else None
    publication_text = " ".join([
        f"{pub.title} {' '.join(pub.keywords)} {pub.abstract or ''}" for pub in all_publications
    ]) if all_publications else None
    

    user_embeddings = {}
    if interest_text:
        user_embeddings['interest'] = model.encode(interest_text, convert_to_tensor=True, normalize_embeddings=True)
    if qualification_text:
        user_embeddings['qualification'] = model.encode(qualification_text, convert_to_tensor=True, normalize_embeddings=True)
    if publication_text:
        user_embeddings['publication'] = model.encode(publication_text, convert_to_tensor=True, normalize_embeddings=True)


    interest_based = []
    publication_based = []
    qualification_based = []

    for grant in precomputed_grants:
        grant_embedding = torch.tensor(grant["grant_embedding"])
        apply_embedding = torch.tensor(grant["apply_embedding"])
        title_embedding = torch.tensor(grant["title_embedding"])

        base_grant_info = {
            "_id": grant["_id"],
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

        if 'interest' in user_embeddings:
            interest_score = float(util.cos_sim(user_embeddings['interest'], title_embedding)[0])
            if interest_score > 0.3:
                    interest_based.append({
                    "reason": "Matches your Topics of Interests",
                    "grant": base_grant_info,
                    "score": interest_score
                })
    
        if 'qualification' in user_embeddings:
            qualification_score = float(util.cos_sim(user_embeddings['qualification'], apply_embedding)[0])
            if qualification_score > 0.3:
                qualification_based.append({
                    "reason": "Matches your Qualifications",
                    "grant": base_grant_info,
                    "score": qualification_score
                })
    
        if 'publication' in user_embeddings:
            publication_score = float(util.cos_sim(user_embeddings['publication'], grant_embedding)[0])
            if publication_score > 0.3:
                publication_based.append({
                    "reason": "Matches your Publication History",
                    "grant": base_grant_info,
                    "score": publication_score
                })
    

    interest_based.sort(key=lambda x: x["score"], reverse=True)
    publication_based.sort(key=lambda x: x["score"], reverse=True)
    qualification_based.sort(key=lambda x: x["score"], reverse=True)

    return {
        "recommended_by_interest": interest_based[:top_n],
        "recommended_by_publications": publication_based[:top_n],
        "recommended_by_qualification": qualification_based[:top_n]
    }
