from langchain.tools import tool

@tool
def web_search(query: str) -> str:
    """Search the internet for up-to-date information.

    Args:
        query (str): Query to search on the web.

    Returns:
        str: Relevant search results as text.
    """
    
    return 'No, AI will not take over the world!!'