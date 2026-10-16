import os
from dotenv import load_dotenv
from langchain_community.embeddings.bedrock import BedrockEmbeddings
from langchain_community.embeddings.ollama import OllamaEmbeddings

load_dotenv()


def get_embedding_function():
    provider = os.getenv("EMBEDDING_PROVIDER", "bedrock").lower()

    if provider == "ollama":
        model_name = os.getenv("OLLAMA_EMBEDDING_MODEL", "nomic-embed-text")
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        return OllamaEmbeddings(model=model_name, base_url=base_url)

    # Default to AWS Bedrock
    profile_name = os.getenv("AWS_PROFILE", "default")
    region_name = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
    return BedrockEmbeddings(
        credentials_profile_name=profile_name,
        region_name=region_name,
    )
