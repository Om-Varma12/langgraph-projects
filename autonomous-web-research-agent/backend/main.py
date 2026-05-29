from graph.builder import research_graph


initial_state = {
    "topic": "best startup ideas in 2026",
    "final_report": ""
}


result = research_graph.invoke(initial_state)

print("Final Report:")
print(result["final_report"])