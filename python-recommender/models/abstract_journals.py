from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List
from sentence_transformers import util
from utils.model_loader import get_model
import torch

router = APIRouter()

class AbstractJournal(BaseModel):
    title: str
    subject_areas: list
    scope: str = ""
    publisher: str = ""
    country_flag: str = ""
    coverage: str = ""
    homepage: str = ""
    publish_guide: str = ""
    contact_email: str = ""
    link: str = ""

class AbstractRequest(BaseModel):
    abstract: str
    journals: List[AbstractJournal]

@router.post("/recommend/journals/by-abstract")
def recommend_by_abstract(data: AbstractRequest, top_n: int = Query(10)):
    model = get_model()

    # Use torch.no_grad() to disable gradient computation (faster)
    with torch.no_grad():
        # Encode once and normalize embeddings
        abstract_embedding = model.encode(
            data.abstract,
            convert_to_tensor=True,
            normalize_embeddings=True
        )

        journal_texts = [f"{j.title} {' '.join(j.subject_areas)} {j.scope}" for j in data.journals]

        journal_embeddings = model.encode(
            journal_texts,
            convert_to_tensor=True,
            normalize_embeddings=True
        )

        # Compute cosine similarity in a single step
        scores = util.cos_sim(abstract_embedding, journal_embeddings)[0]

    # Use list comprehension for faster scoring
    results = [
        {
            "journal": data.journals[i],
            "score": float(score)
        }
        for i, score in enumerate(scores)
        if score > 0.25
    ]

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_n]
