from transformers import AutoTokenizer, AutoModelForCausalLM
from typing import List, Dict


class GemmaService:
    """Service class for interacting with the Gemma 2b-it model."""
    
    _instance = None
    _model = None
    _tokenizer = None
    
    def __new__(cls):
        """Singleton pattern to ensure only one model instance is loaded."""
        if cls._instance is None:
            cls._instance = super(GemmaService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize the Gemma service by loading the model and tokenizer."""
        if self._model is None or self._tokenizer is None:
            self._load_model()
    
    @classmethod
    def _load_model(cls):
        """Load the Gemma model and tokenizer from HuggingFace."""
        print("Loading Gemma 2b-it model and tokenizer...")
        cls._tokenizer = AutoTokenizer.from_pretrained("google/gemma-2-2b-it")
        cls._model = AutoModelForCausalLM.from_pretrained("google/gemma-2-2b-it")
        print("Model and tokenizer loaded successfully!")
    
    def generate_response(
        self,
        prompt: str,
        max_new_tokens: int = 40
    ) -> str:
        """
        Generate a response from the model given a single user prompt string.

        Args:
            prompt: The user's prompt text to send to the model.
            max_new_tokens: Maximum number of tokens to generate (default: 40)

        Returns:
            The generated response text
        """
        # Build messages list from a single user prompt
        messages = [{"role": "user", "content": prompt}]

        inputs = self._tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt",
        ).to(self._model.device)

        outputs = self._model.generate(**inputs, max_new_tokens=max_new_tokens)
        response = self._tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:])

        return response
