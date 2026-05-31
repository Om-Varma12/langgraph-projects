from graph.builder import research_graph


initial_state = {
    "topic": "Future of autonomous AI coding agents",
    "research_plan": "",
    "search_queries": [],
    "subagent_tasks": [],
    "verification_focus": [],
    "current_search_results": [],
    "current_subagent_findings": [],
    "verified_findings": [],
    "warnings": [],
    "missing_areas": [],
    "iteration": 0,
    "max_iterations": 2,
    "final_report": ""
}


result = research_graph.invoke(initial_state)

print(result["final_report"])