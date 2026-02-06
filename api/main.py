from typing_extensions import Annotated

from fastapi import Body, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from gemma_service import GemmaService

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_gemma_service() -> GemmaService:
    return GemmaService()

class Message(BaseModel):
    msg: str

@app.get("/")
def hello_world() -> dict:
    return {"message": "Hello from KostaGPT"}

@app.post("/")
def send_message(
    message: Annotated[Message, Body()],
    gemma_service: Annotated[GemmaService, Depends(get_gemma_service)],
) -> str:
    response = gemma_service.generate_response(message.msg, max_new_tokens=200)
    response = response.replace("<end_of_turn>", "")
    return response