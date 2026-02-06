# KostaGPT

A minimal repository for KostaGPT's API service and example usage.

## About

This repository contains a small API service and example scripts demonstrating how to use it. The service implementation and examples live under the `api/` folder.

## Repository structure

- api/
  - example_usage.py — example client usage
  - gemma_service.py — core service implementation
  - main.py — API launch/entrypoint
  - README.md — API-specific docs
  - LICENSE — license for API code

## Requirements

- Python 3.8+
- Recommended: create and use a virtual environment

## Installation

From the repository root, create and activate a virtualenv, then install required packages if any:

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# If there is a requirements file, install it (none provided by default)
# pip install -r requirements.txt
```

## Running the API

Start the API service:

```bash
python -m uvicorn main:app --reload
```

## Example usage

See the example client at [api/example_usage.py](api/example_usage.py) for a quick demonstration of how to call the service.

## Key files

- [api/main.py](api/main.py) — application entrypoint
- [api/gemma_service.py](api/gemma_service.py) — service implementation
- [api/example_usage.py](api/example_usage.py) — usage example
- [api/LICENSE](api/LICENSE) — license
