from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List, Optional
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
    grants: List[Grant]

@app.post("/recommend/grants")
def recommend_grants(data: RecommendRequest, top_n: int = Query(10)):
    user_interest_text = " ".join(data.user_interests)

    # Use only title, keywords, and abstract
    publication_text = " ".join([
        f"{pub.title} {' '.join(pub.keywords)} {pub.abstract}"
        for pub in data.publications or []
    ])

    user_text = f"{user_interest_text} {publication_text}"

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
            "matched_keywords": list(set([
    kw for kw in data.user_interests + sum([p.keywords for p in data.publications or []], [])
    if kw.lower() in f"{g.title} {g.description} {g.scope}".lower()
]))

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
    conferences: List[Conference]

@app.post("/recommend/conferences")
def recommend_conferences(data: RecommendConferenceRequest, top_n: int = Query(10)):
    # Combine user interests and publication fields into user_text
    interest_text = " ".join(data.user_interests)

    publication_text = " ".join([
        f"{p.title} {p.journal} {' '.join(p.keywords)}"
        for p in data.publications or []
    ])

    user_text = f"{interest_text} {publication_text}".strip().lower()
    conference_titles = [c.title.lower() for c in data.conferences]

    vectorizer = TfidfVectorizer(ngram_range=(1, 3))
    vectors = vectorizer.fit_transform([user_text] + conference_titles)
    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    # Collect all keywords from interests + publications
    combined_keywords = list(set(
        data.user_interests + sum([p.keywords for p in data.publications or []], [])
    ))
    combined_keywords = [kw.strip().lower() for kw in combined_keywords]

    recommendations = []
    for c, s, text in zip(data.conferences, scores, conference_titles):
        matched = [kw for kw in combined_keywords if kw in text]

        if s > 0.05:
            recommendations.append({
                "conference": c,
                "score": float(s),
                "matched_keywords": list(set(matched))  # includes both interest + pub keywords
            })

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
    journals: List[Journal]

@app.post("/recommend/journals")
def recommend_journals(data: RecommendJournalRequest, top_n: int = Query(10)):
    interest_text = " ".join(data.user_interests)
    publication_text = " ".join([
        f"{pub.title} {pub.journal} {' '.join(pub.keywords)}"
        for pub in data.publications or []
    ])
    user_text = f"{interest_text} {publication_text}".strip().lower()

    journal_texts = [f"{j.title} {j.subject_areas}".lower() for j in data.journals]

    # Vectorizer with n-grams to catch phrases like "machine learning"
    vectorizer = TfidfVectorizer(ngram_range=(1, 3))
    vectors = vectorizer.fit_transform([user_text] + journal_texts)
    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    # Combine keywords from interests and publications
    combined_keywords = list(set(
        data.user_interests + sum([p.keywords for p in data.publications or []], [])
    ))
    combined_keywords = [kw.strip().lower() for kw in combined_keywords]

    recommendations = []
    for j, s, text in zip(data.journals, scores, journal_texts):
        matched = [kw for kw in combined_keywords if kw in text]

        # Only include results where a full keyword/phrase matched
        if matched and s > 0.05:
            recommendations.append({
                "journal": j,
                "score": float(s),
                "matched_keywords": list(set(matched))
            })

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:top_n]



# uvicorn main:app --reload --port 8000