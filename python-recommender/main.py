from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.grants import router as grants_router
from models.conference import router as conf_router
from models.journal import router as journals_router
from models.abstract_journals import router as abstract_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(grants_router)
app.include_router(conf_router)
app.include_router(journals_router)
app.include_router(abstract_router)


# uvicorn main:app --reload --port 8000