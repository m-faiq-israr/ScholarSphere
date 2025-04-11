from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# === GRANT MODELS ===
class Grant(BaseModel):
    title: str
    description: str
    scope: str
    opening_date: str = ""
    closing_date: str = ""
    who_can_apply: str = ""

class RecommendRequest(BaseModel):
    user_interests: List[str]
    grants: List[Grant]

@app.post("/recommend/grants")
def recommend_grants(data: RecommendRequest, top_n: int = Query(10)):
    user_text = " ".join(data.user_interests)

    grant_texts = [
        f"{g.title} {g.description} {g.scope}" for g in data.grants
    ]

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_text] + grant_texts)
    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    recommendations = [
        {
            "grant": g,
            "score": float(s),
            "matched_keywords": [kw for kw in data.user_interests if kw.lower() in f"{g.title} {g.description} {g.scope}".lower()]
        }
        for g, s in zip(data.grants, scores) if s > 0
    ]

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:top_n]

# === CONFERENCE MODELS ===
class Conference(BaseModel):
    title: str
    date: str = ""
    location: str = ""
    link: str = ""

class RecommendConferenceRequest(BaseModel):
    user_interests: List[str]
    conferences: List[Conference]

@app.post("/recommend/conferences")
def recommend_conferences(data: RecommendConferenceRequest, top_n: int = Query(10)):
    user_text = " ".join(data.user_interests)

    # ✅ Only compare the title of each conference
    conference_titles = [c.title for c in data.conferences]

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_text] + conference_titles)
    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    recommendations = [
        {
            "conference": c,
            "score": float(s),
            "matched_keywords": [kw for kw in data.user_interests if kw.lower() in c.title.lower()]
        }
        for c, s in zip(data.conferences, scores) if s > 0
    ]

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:top_n]


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


class RecommendJournalRequest(BaseModel):
    user_interests: List[str]
    journals: List[Journal]

@app.post("/recommend/journals")
def recommend_journals(data: RecommendJournalRequest, top_n: int = Query(10)):
    user_text = " ".join(data.user_interests)

    journal_texts = [f"{j.title} {j.subject_areas}" for j in data.journals]

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_text] + journal_texts)
    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    recommendations = [
        {
            "journal": j,
            "score": float(s),
            "matched_keywords": [kw for kw in data.user_interests if kw.lower() in f"{j.title} {j.subject_areas}".lower()]
        }
        for j, s in zip(data.journals, scores) if s > 0
    ]

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:top_n]





# uvicorn main:app --reload --port 8000