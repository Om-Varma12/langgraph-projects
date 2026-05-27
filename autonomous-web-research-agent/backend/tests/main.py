from graph.builder import research_graph


initial_state = {
    "topic": "Future of autonomous AI coding agents",
    "search_queries": [],
    "search_results": [],
    "visited_urls": [],
    "findings": [],
    "is_research_complete": False,
    "iteration": 0,
    "final_report": ""
}


result = research_graph.invoke(initial_state)

print(result["final_report"])