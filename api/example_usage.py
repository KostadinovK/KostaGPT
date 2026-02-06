"""
Example script demonstrating how to use the GemmaService class directly
in a plain Python script (without FastAPI).
"""

from gemma_service import GemmaService


def main():
    """Main function to demonstrate GemmaService usage."""
    
    # Initialize the service (loads the model on first instantiation)
    service = GemmaService()
    
    # Example 1: Simple question
    print("=" * 50)
    print("Example 1: Simple Question")
    print("=" * 50)
    
    messages = [
        {"role": "user", "content": "Who are you?"},
    ]
    prompt = messages[0]["content"]

    response = service.generate_response(prompt)
    print(f"User: {prompt}")
    print(f"Gemma: {response}")
    print()
    
    # Example 2: Multi-turn conversation
    print("=" * 50)
    print("Example 2: Multi-turn Conversation")
    print("=" * 50)
    
    messages = [
        {"role": "user", "content": "What is machine learning?"},
        {"role": "assistant", "content": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed."},
        {"role": "user", "content": "Can you give me an example?"},
    ]
    prompt = messages[-1]["content"]

    response = service.generate_response(prompt, max_new_tokens=60)
    print(f"User: {prompt}")
    print(f"Gemma: {response}")
    print()
    
    # Example 3: Custom max tokens
    print("=" * 50)
    print("Example 3: Longer Response (100 tokens)")
    print("=" * 50)
    
    messages = [
        {"role": "user", "content": "Explain the concept of neural networks."},
    ]
    prompt = messages[0]["content"]

    response = service.generate_response(prompt, max_new_tokens=100)
    print(f"User: {prompt}")
    print(f"Gemma: {response}")


if __name__ == "__main__":
    main()
