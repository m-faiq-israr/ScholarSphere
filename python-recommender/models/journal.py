from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
import numpy as np
import time 

router = APIRouter()


class Journal(BaseModel):
    title: str
    subject_areas: str
    publisher: str = ""
    country_flag: str = ""
    coverage: str = ""
    homepage: str = ""
    publish_guide: str = ""
    contact_email: str = ""
    link: str = ""

class Publication(BaseModel):
    title: str
    journal: str
    year: str = ""
    authors: List[str] = []
    keywords: List[str] = []
    abstract: str = ""

class RecommendJournalRequest(BaseModel):
    user_interests: List[str]
    publications: Optional[List[Publication]] = []
    fetched_publications: Optional[List[Publication]] = []
    journals: List[Journal]

@router.post("/recommend/journals")
def recommend_journals(data: RecommendJournalRequest, top_n: int = Query(10)):
    interest_text = " ".join(data.user_interests)

    all_publications = (data.publications or []) + (data.fetched_publications or [])

    publication_text = " ".join([
        f"{pub.title} {pub.journal} {' '.join(pub.keywords)}"
        for pub in all_publications
    ])

    user_text = f"{interest_text} {publication_text}".strip().lower()
    journal_texts = [f"{j.title} {j.subject_areas}".lower() for j in data.journals]

    vectorizer = TfidfVectorizer(ngram_range=(1, 3))
    vectors = vectorizer.fit_transform([user_text] + journal_texts)
    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    combined_keywords = list(set(
        data.user_interests + sum([p.keywords for p in all_publications], [])
    ))
    combined_keywords = [kw.strip().lower() for kw in combined_keywords]

    recommendations = []
    for j, s, text in zip(data.journals, scores, journal_texts):
        matched = [kw for kw in combined_keywords if kw in text]

        if matched and s > 0.05:
            recommendations.append({
                "journal": j,
                "score": float(s),
                "matched_keywords": list(set(matched))
            })

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:top_n]
