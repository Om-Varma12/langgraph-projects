from langchain_groq import ChatGroq
from langchain.agents import create_agent

import json

from prompts.prompt import PLANNER
from tools.web_search import web_search

from dotenv import load_dotenv
load_dotenv()


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    # reasoning_effort="none",
    streaming=False,
)


planner_agent = create_agent(
    model=llm
)


summarizer_agent = create_agent(
    model=llm
)



def planner_node(state):
    print("planner agent start")
    topic = state["topic"]
    findings = state["findings"]
    previous_queries = state["search_queries"]

    prompt = f"""
        {PLANNER}

        TOPIC:
        {topic}

        CURRENT FINDINGS:
        {findings}

        PREVIOUS SEARCH QUERIES:
        {previous_queries}

        IMPORTANT:
        - Do NOT repeat previous searches
        - Generate only NEW search queries
        - Maximum 5 queries

        Generate new search queries.
    """

    response = planner_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
    )

    content = response["messages"][-1].content

    content = content.replace("```json", "").replace("```", "").strip()
    parsed = json.loads(content)
    queries = parsed["search_queries"]
    
    print("planner agent end")

    return {
        "search_queries": queries
    }
    
    
def searcher_node(state):
    print("search node start")
    queries = state["search_queries"]

    results = []

    for query in queries:
        result = web_search(query)
        results.append(result)

    print("search node end")
    return {
        "search_results": results
    }
    
    
def summarizer_node(state):
    print("summa agent start")
    search_results = state["search_results"]
    findings = state["findings"]
    iteration = state["iteration"]

    prompt = f"""
        You are a research summarizer.

        SEARCH RESULTS:
        {search_results}

        PREVIOUS FINDINGS:
        {findings}

        Tasks:
        1. Summarize important insights
        2. Decide if more research is needed

        Return format:

        SUMMARY:
        ...

        RESEARCH_COMPLETE:
        true/false
    """

    response = summarizer_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
    )

    content = response["messages"][-1].content

    is_complete = "true" in content.lower()

    print("summa agent end")
    return {
        "findings": findings + [content],
        "iteration": iteration + 1,
        "is_research_complete": is_complete
    }
    
    
MAX_ITERATIONS = 5
def should_continue(state):
    if state["iteration"] >= MAX_ITERATIONS:
        return True

    return state["is_research_complete"]


def final_report(state):
    print("final report start")
    findings = state["findings"]
    topic = state["topic"]

    prompt = f"""
        Create a final detailed research report.

        TOPIC:
        {topic}

        FINDINGS:
        {findings}
    """

    response = summarizer_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
    )

    report = response["messages"][-1].content

    print("final report end")
    return {
        "final_report": report
    }