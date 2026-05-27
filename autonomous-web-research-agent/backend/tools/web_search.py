from tavily import TavilyClient
from dotenv import load_dotenv
load_dotenv() 
import trafilatura
import requests


client = TavilyClient()


def scrape_page(url: str) -> str:
    """
    Scrape and extract clean text from webpage.
    """

    try:
        downloaded = trafilatura.fetch_url(url)
        
        if not downloaded:
            return ""

        text = trafilatura.extract(downloaded)

        return text or ""

    except Exception as e:
        print(f"Scraping error: {e}")
        return ""


def web_search(query: str) -> str:
    """
    Search internet and scrape relevant webpages.
    """
    print(f"Searching: {query}")

    response = client.search(
        query=query,
        max_results=2
    )

    results = response.get("results", [])

    final_text = []

    for result in results:
        url = result.get("url", "")
        title = result.get("title", "")
        snippet = result.get("content", "")

        print(f"Scraping: {url}")

        scraped_content = scrape_page(url)

        if scraped_content:
            scraped_content = scraped_content[:4000]

        page_text = f"""
            TITLE: {title}

            URL: {url}

            SNIPPET:
            {snippet}

            SCRAPED CONTENT:
            {scraped_content}
        """
        final_text.append(page_text)

    return "\n\n".join(final_text)