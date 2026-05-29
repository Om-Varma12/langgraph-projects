from langgraph.graph import StateGraph, END

from graph.state import State
from graph.nodes import lead_agent_node



graph = StateGraph(State)


graph.add_node("lead_agent", lead_agent_node)

graph.set_entry_point("lead_agent")

graph.add_edge("lead_agent", END)


research_graph = graph.compile()