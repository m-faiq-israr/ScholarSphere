from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer, util

router = APIRouter()

# ✅ Load the model once globally
model = SentenceTransformer('all-MiniLM-L6-v2')

class Conference(BaseModel):
    title: str
    date: str = ""
    location: str = ""
    link: str = ""

class Publication(BaseModel):
    title: str
    journal: str
    year: str
    authors: List[str]
    keywords: List[str]
    abstract: str

class RecommendConferenceRequest(BaseModel):
    user_interests: List[str]
    publications: Optional[List[Publication]] = []
    fetched_publications: Optional[List[Publication]] = []
    conferences: List[Conference]

@router.post("/recommend/conferences")
def recommend_conferences(data: RecommendConferenceRequest, top_n: int = Query(10)):
    # ✅ Merge user interests
    interest_text = " ".join(data.user_interests)

    # ✅ Merge publication titles + keywords
    all_publications = (data.publications or []) + (data.fetched_publications or [])
    publication_text = " ".join([
        f"{pub.title} {' '.join(pub.keywords)}" for pub in all_publications
    ])

    # ✅ User query = interests + titles + keywords
    user_text = f"{interest_text} {publication_text}".strip()

    # ✅ Conference titles
    conference_texts = [c.title for c in data.conferences]

    # ✅ Encode user text and conference titles
    user_embedding = model.encode(user_text, convert_to_tensor=True, normalize_embeddings=True)
    conference_embeddings = model.encode(conference_texts, convert_to_tensor=True, normalize_embeddings=True)

    # ✅ Semantic similarity
    similarities = util.cos_sim(user_embedding, conference_embeddings)[0]

    recommendations = []
    for conf, score in zip(data.conferences, similarities):
        if score > 0.25:  # you can tune this threshold if needed
            recommendations.append({
                "conference": conf,
                "score": float(score)
            })

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:top_n]
