# 📌 Baseline RAG Version

## 🔑 Key Components

1. **Embedding Model**
   - Used `jina-embeddings-v5-text-small`
   - Supports **Matryoshka Representation Learning (MRL)**
   - Allows flexible control over embedding dimensions based on use case

2. **Re-ranking Model**
   - Used `BAAI/bge-reranker-base`
   - Improves retrieval quality by re-ranking candidate chunks based on query relevance

---

## 📚 What I Learned

1. **Building a Basic RAG Pipeline**
   - Implemented a simple Retrieval-Augmented Generation (RAG) pipeline without using the LangChain framework

2. **Matryoshka Representation Learning (MRL)**
   - Enables dynamic adjustment of embedding dimensions while preserving semantic meaning

3. **Re-rankers**
   - Purpose: Improve retrieval accuracy
   - Insight:  
     > Vector search retrieves candidate chunks, but a re-ranker identifies which chunks best answer the user’s query

4. **Cross-Encoders**
   - Mechanism: Jointly processes query–chunk pairs
   - Insight:  
     > A cross-encoder scores query and chunk together to determine true semantic relevance