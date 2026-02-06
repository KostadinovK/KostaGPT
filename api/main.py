from typing_extensions import Annotated

from fastapi import Body, Depends, FastAPI
from pydantic import BaseModel

from gemma_service import GemmaService

app = FastAPI()

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
    return response