from services.embedding.pdf_reader import readPDF
from services.embedding.pdf_chunker import chunk
from services.embedding.chunk_embedder import embedd
from services.embedding.vector_store import store

def ingest(pdfName):
    content = readPDF(pdfName)
    chunks = chunk(content)
    embeddings = embedd(chunks)
    result = store(embeddings)
    
    print('done')
    
    
ingest('specforge.pdf')