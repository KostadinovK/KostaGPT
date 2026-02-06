# KostaGPT
a very simple playground for a text generative model and api
## Requirements
 ### For Gemma AI Model
- PyTorch must be installed
- HuggingFace account (required to access Gemma model)
- Must be authenticated with `huggingface-cli login` or `hf auth login`

### For the FastAPI API
- FastAPI framework
- Uvicorn (ASGI server)
- Python 3.8 or higher

### Installation Commands

```bash
pip install transformers accelerate sentencepiece safetensors
pip install bitsandbytes  # for GPU processing
pip install fastapi uvicorn  # for FastAPI API
```

### Authentication

Before running the script, authenticate with HuggingFace:
```bash
huggingface-cli login
# or
hf auth login
```

## Starting the Dev Server
Run
```bash
python -m uvicorn main:app --reload
```

## Running just the Gemma service (for test purposes)
Run
```bash
python example_usage.py
```