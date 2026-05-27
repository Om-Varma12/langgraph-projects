from langgraph.graph import StateGraph, END

from graph.state import State

from graph.nodes import planner_node, searcher_node, summarizer_node, should_continue, final_report


graph = StateGraph(State)
graph.add_node("planner", planner_node)
graph.add_node("searcher", searcher_node)
graph.add_node("summarizer", summarizer_node)
graph.add_node("report", final_report)


graph.set_entry_point("planner")


graph.add_edge("planner", "searcher")
graph.add_edge("searcher", "summarizer")

graph.add_conditional_edges(
    "summarizer", 
    should_continue, 
    {
        True: "report", 
        False: "planner"
    }
)

graph.add_edge("report", END)

research_graph = graph.compile()