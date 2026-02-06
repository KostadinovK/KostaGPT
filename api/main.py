from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def hello_world():
    return {"message": "Hello from KostaGPT"}

@app.post("/")
def send_message(message: str):
    response = f"Received your message: {message}"
    return response