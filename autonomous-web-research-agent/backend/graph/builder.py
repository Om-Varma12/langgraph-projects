from langgraph.graph import StateGraph, END

from graph.state import State
from graph.nodes import planner_node, report_node, searcher_node, verifier_node



graph = StateGraph(State)


graph.add_node("planner", planner_node)
graph.add_node("searcher", searcher_node)
graph.add_node("verifier", verifier_node)
graph.add_node("report", report_node)

graph.set_entry_point("planner")

graph.add_edge("planner", "searcher")
graph.add_edge("searcher", "verifier")


def route_after_verifier(state):
	if state.get("needs_more_research") and state.get("iteration", 0) < state.get("max_iterations", 2):
		return "planner"
	return "report"


graph.add_conditional_edges(
	"verifier",
	route_after_verifier,
	{
		"planner": "planner",
		"report": "report",
	},
)

graph.add_edge("report", END)


research_graph = graph.compile()