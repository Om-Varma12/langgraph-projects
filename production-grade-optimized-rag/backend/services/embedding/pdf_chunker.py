def chunk(
    content: str,
    chunk_size: int = 1000,
    overlap: int = 200
) -> list[str]:
        
    print('pdf chunker started')
    
    start = 0
    chunks = []
    while start < len(content):
        end = start + chunk_size
        chunks.append(content[start:end])
        start = end - overlap
        

    print('pdf chunker ended')
        
    print("total chunks: ", len(chunks))
    return chunks
