from typing import List
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class EmbeddingsService:
    def __init__(self, embedding_model):
        self.embedding_model = embedding_model

    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        return self.embedding_model.encode(texts)

    def calculate_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        return cosine_similarity([embedding1], [embedding2])[0][0]