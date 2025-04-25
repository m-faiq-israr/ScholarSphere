from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer, util

router = APIRouter()

# ✅ Load the model once globally
model = SentenceTransformer('all-MiniLM-L6-v2')

class Grant(BaseModel):
    title: str
    description: str
    scope: str
    opening_date: str = ""
    closing_date: str = ""
    who_can_apply: str = ""

class Publication(BaseModel):
    title: str
    journal: str
    year: str
    authors: List[str]
    keywords: List[str]
    abstract: str

class RecommendRequest(BaseModel):
    user_interests: List[str]
    publications: Optional[List[Publication]] = []
    fetched_publications: Optional[List[Publication]] = []
    grants: List[Grant]

@router.post("/recommend/grants")
def recommend_grants(data: RecommendRequest, top_n: int = Query(10)):
    # ✅ Merge user interests
    user_interest_text = " ".join(data.user_interests)

    # ✅ Merge publications (titles + keywords + abstracts)
    all_publications = (data.publications or []) + (data.fetched_publications or [])
    publication_text = " ".join([
        f"{pub.title} {' '.join(pub.keywords)} {pub.abstract or ''}" for pub in all_publications
    ])

    # ✅ User final text
    user_text = f"{user_interest_text} {publication_text}".strip()

    # ✅ Grant texts (title + description + scope)
    grant_texts = [
        f"{g.title} {g.description} {g.scope}".strip() for g in data.grants
    ]

    # ✅ Encode embeddings
    user_embedding = model.encode(user_text, convert_to_tensor=True, normalize_embeddings=True)
    grant_embeddings = model.encode(grant_texts, convert_to_tensor=True, normalize_embeddings=True)

    # ✅ Semantic similarity
    similarities = util.cos_sim(user_embedding, grant_embeddings)[0]

    # ✅ Collect recommendations
    combined_keywords = data.user_interests + sum([p.keywords for p in all_publications], [])

    recommendations = []
    for g, score, text in zip(data.grants, similarities, grant_texts):
        if score > 0.25:  # adjustable threshold
            matched_keywords = list(set([
                kw for kw in combined_keywords if kw.lower() in text.lower()
            ]))

            recommendations.append({
                "grant": g,
                "score": float(score),
                "matched_keywords": matched_keywords
            })

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:top_n]
