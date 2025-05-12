import json
import torch
import os
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

current_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(current_dir, "conferences_with_embeddings.json")

with open(json_path, "r", encoding="utf-8") as f:
    precomputed_conferences = json.load(f)

router = APIRouter()

class Conference(BaseModel):
    title: str
    topics: Optional[str] = "" 
    start_date: str = ""
    end_date: str = ""
    location: str = ""
    link: str = ""

class Publication(BaseModel):
    title: str
    journal: str
    year: str
    authors: List[str]
    keywords: List[str]
    abstract: Optional[str] = ""

class RecommendConferenceRequest(BaseModel):
    user_interests: List[str]
    publications: Optional[List[Publication]] = []
    fetched_publications: Optional[List[Publication]] = []

@router.post("/recommend/conferences")
def recommend_conferences(data: RecommendConferenceRequest, top_n: int = Query(30)):
    all_publications = (data.publications or []) + (data.fetched_publications or [])

    interest_text = " ".join(data.user_interests)
    publication_text = " ".join([
        f"{pub.title} {' '.join(pub.keywords)} {pub.abstract or ''}" for pub in all_publications
    ])

    user_embeddings = model.encode(
        [interest_text, publication_text],
        convert_to_tensor=True,
        normalize_embeddings=True
    )
    interest_embedding, publication_embedding = user_embeddings

    interest_based = []
    publication_based = []

    for conf in precomputed_conferences:
        topics_string = conf.get("topics", "")
        topics_list = [t.strip() for t in topics_string.split(",")] if isinstance(topics_string, str) else []

        combined_text = f"{conf['title']} {' '.join(topics_list)}"
        conference_embedding = torch.tensor(conf["conference_embedding"])

        interest_score = float(util.cos_sim(interest_embedding, conference_embedding)[0])
        publication_score = float(util.cos_sim(publication_embedding, conference_embedding)[0])

        base_conf_info = {
            "_id": conf["_id"],
            "title": conf["title"],
            "topics": topics_string,
            "start_date": conf.get("start_date", ""),
            "end_date": conf.get("end_date", ""),
            "location": conf.get("location", ""),
            "link": conf.get("link", "")
        }

        if interest_score > 0.3:
            interest_based.append({
                "reason": "Matches your Topics of Interests",
                "conference": base_conf_info,
                "score": interest_score
            })

        if publication_score > 0.3:
            publication_based.append({
                "reason": "Matches your Publication History",
                "conference": base_conf_info,
                "score": publication_score
            })

    interest_based.sort(key=lambda x: x["score"], reverse=True)
    publication_based.sort(key=lambda x: x["score"], reverse=True)
    print("Interest-based matches:", len(interest_based))
    print("Publication-based matches:", len(publication_based))


    return {
        "recommended_by_interest": interest_based[:top_n],
        "recommended_by_publications": publication_based[:top_n]
    }
