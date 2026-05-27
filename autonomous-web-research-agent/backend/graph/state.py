from typing import TypedDict, List


class State(TypedDict):
    topic: str
    search_queries: List[str]
    search_results: List[str]
    findings: List[str]
    iteration: int
    is_research_complete: bool
    final_report: str