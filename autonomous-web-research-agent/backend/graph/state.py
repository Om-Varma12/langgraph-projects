from typing import TypedDict


class State(TypedDict, total=False):
    topic: str
    current_date: str
    research_plan: str
    search_queries: list[str]
    subagent_tasks: list[dict[str, str]]
    verification_focus: list[str]
    current_search_results: list[str]
    current_subagent_findings: list[str]
    verified_findings: list[str]
    warnings: list[str]
    missing_areas: list[str]
    needs_more_research: bool
    iteration: int
    max_iterations: int
    final_report: str