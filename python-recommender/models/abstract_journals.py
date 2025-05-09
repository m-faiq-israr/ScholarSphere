from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer, util
import numpy as np
import json
import os

router = APIRouter()

model = SentenceTransformer("all-MiniLM-L6-v2")
base_dir = os.path.dirname(os.path.abspath(__file__))
embeddings_path = os.path.join(base_dir, "journals_with_embeddings.json")

with open(embeddings_path, "r") as f:
    embedding_data = json.load(f)

class Journal(BaseModel):
    title: str
    subject_areas: List[str]
    scope: str = ""
    publisher: str = ""
    country: str = ""
    coverage: str = ""
    homepage: str = ""
    publish_guide: str = ""
    contact_email: str = ""
    link: str = ""

class RecommendByAbstractRequest(BaseModel):
    abstract: str
    journals: List[Journal]

@router.post("/recommend/journals/by-abstract")
def recommend_by_abstract(data: RecommendByAbstractRequest, top_n: int = Query(20)):
    abstract_embedding = model.encode(data.abstract, convert_to_tensor=True)

    scored_results = []
    for journal, emb_str, _id in zip(data.journals, embedding_data["embeddings"], embedding_data["ids"]):
        sim_score = util.cos_sim(abstract_embedding, emb_str).item()
        if sim_score > 0.4:
            scored_results.append({
                "journal": { **journal.model_dump(), "_id": _id },
                "score": sim_score
            })

    scored_results.sort(key=lambda x: x["score"], reverse=True)
    return scored_results[:top_n]
