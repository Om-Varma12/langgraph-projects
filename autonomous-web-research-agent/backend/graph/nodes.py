import json
import re
from datetime import datetime

from langchain_groq import ChatGroq
from dotenv import load_dotenv
from prompts.prompt import PLAN_PROMPT, REPORT_PROMPT, VERIFIER_PROMPT
from tools.subagent_spawner import spawn_sub_agent
from tools.web_search import web_search as fetch_web_search

load_dotenv()


today = datetime.now().strftime("%Y-%m-%d")


llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0
)


def _invoke_llm(system_prompt: str, user_prompt: str) -> str:
    result = llm.invoke(
        [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]
    )
    return result.content if hasattr(result, "content") else str(result)


def _parse_json_payload(text: str) -> dict:
    cleaned_text = text.strip()

    if cleaned_text.startswith("```"):
        cleaned_text = re.sub(r"^```(?:json)?\s*", "", cleaned_text)
        cleaned_text = re.sub(r"\s*```$", "", cleaned_text)

    start = cleaned_text.find("{")
    end = cleaned_text.rfind("}")
    if start != -1 and end != -1 and end > start:
        cleaned_text = cleaned_text[start:end + 1]

    try:
        parsed = json.loads(cleaned_text)
        return parsed if isinstance(parsed, dict) else {}
    except json.JSONDecodeError:
        return {}


def _coerce_string_list(values):
    if not isinstance(values, list):
        return []
    return [item for item in values if isinstance(item, str) and item.strip()]


def _coerce_task_list(values):
    if not isinstance(values, list):
        return []

    tasks = []
    for item in values:
        if isinstance(item, dict):
            task = item.get("task")
            precise_prompt = item.get("precise_prompt")
            if isinstance(task, str) and isinstance(precise_prompt, str):
                tasks.append({"task": task, "precise_prompt": precise_prompt})
    return tasks


def _dedupe_strings(values):
    seen = set()
    deduped = []

    for value in values:
        if value not in seen:
            seen.add(value)
            deduped.append(value)

    return deduped


def planner_node(state):
    print("planner start")

    topic = state["topic"]
    current_date = state.get("current_date", today)
    missing_areas = _coerce_string_list(state.get("missing_areas"))[:3]
    verified_findings = _coerce_string_list(state.get("verified_findings"))
    warnings = _coerce_string_list(state.get("warnings"))
    prompt = f"""
TOPIC:
{topic}

CURRENT DATE:
{current_date}

MISSING AREAS FROM VERIFIER:
{chr(10).join(f'- {item}' for item in missing_areas)}

VERIFIED FINDINGS:
{chr(10).join(f'- {item}' for item in verified_findings)}

WARNINGS:
{chr(10).join(f'- {item}' for item in warnings)}
"""

    raw_output = _invoke_llm(
        f"{PLAN_PROMPT}\n\nCURRENT DATE: {current_date}",
        prompt,
    )
    parsed = _parse_json_payload(raw_output)

    research_plan = parsed.get("research_plan")
    search_queries = _coerce_string_list(parsed.get("search_queries"))[:3]
    subagent_tasks = _coerce_task_list(parsed.get("subagent_tasks"))[:3]
    verification_focus = _coerce_string_list(parsed.get("verification_focus"))

    if missing_areas:
        search_queries = [f"{topic} {area}" for area in missing_areas][:3]
        subagent_tasks = [
            {
                "task": f"Investigate {area}",
                "precise_prompt": f"Gather source-backed evidence about {area} in the context of {topic}.",
            }
            for area in missing_areas[:3]
        ]

    if not isinstance(research_plan, str) or not research_plan.strip():
        research_plan = f"Research the missing areas for: {topic}" if missing_areas else f"Research the current state of: {topic}"

    if not search_queries:
        search_queries = [topic]

    if not subagent_tasks:
        subagent_tasks = [
            {
                "task": "Check recent context",
                "precise_prompt": f"Find the most recent, high-signal updates relevant to: {search_queries[0]}",
            }
        ]

    print("planner end")

    return {
        "current_date": current_date,
        "research_plan": research_plan,
        "search_queries": search_queries,
        "subagent_tasks": subagent_tasks,
        "verification_focus": verification_focus,
        "iteration": state.get("iteration", 0),
        "max_iterations": state.get("max_iterations", 2),
        "current_search_results": [],
        "current_subagent_findings": [],
        "verified_findings": state.get("verified_findings", []),
        "warnings": state.get("warnings", []),
        "missing_areas": missing_areas,
        "needs_more_research": state.get("needs_more_research", False),
    }


def searcher_node(state):
    print("searcher start")

    queries = state.get("search_queries") or []
    subagent_tasks = state.get("subagent_tasks") or []

    search_results = []
    subagent_findings = []

    for query in queries[:3]:
        try:
            search_results.append(f"QUERY: {query}\n{fetch_web_search(query)}")
        except Exception as exc:
            search_results.append(f"QUERY: {query}\nSEARCH ERROR: {exc}")

    for task in subagent_tasks[:3]:
        task_name = task.get("task", "Research task")
        precise_prompt = task.get("precise_prompt", task_name)
        try:
            result = spawn_sub_agent.invoke(
                {
                    "task": task_name,
                    "precise_prompt": precise_prompt,
                }
            )
            subagent_findings.append(f"TASK: {task_name}\n{result}")
        except Exception as exc:
            subagent_findings.append(f"TASK: {task_name}\nSUB-AGENT ERROR: {exc}")

    print("searcher end")

    return {
        "current_search_results": search_results,
        "current_subagent_findings": subagent_findings,
        "iteration": state.get("iteration", 0) + 1,
    }


def verifier_node(state):
    print("verifier start")

    evidence_chunks = []
    for chunk in (state.get("current_search_results", []) + state.get("current_subagent_findings", []))[:6]:
        evidence_chunks.append(chunk[:3500])

    prompt = f"""
TOPIC:
{state.get('topic', '')}

CURRENT DATE:
{state.get('current_date', today)}

RESEARCH PLAN:
{state.get('research_plan', '')}

VERIFICATION FOCUS:
{chr(10).join(f'- {item}' for item in state.get('verification_focus', []))}

PREVIOUS VERIFIED FINDINGS:
{chr(10).join(f'- {item}' for item in state.get('verified_findings', []))}

PREVIOUS WARNINGS:
{chr(10).join(f'- {item}' for item in state.get('warnings', []))}

EVIDENCE:
{chr(10).join(evidence_chunks)}
"""

    raw_output = _invoke_llm(
        f"{VERIFIER_PROMPT}\n\nCURRENT DATE: {state.get('current_date', today)}",
        prompt,
    )
    parsed = _parse_json_payload(raw_output)

    current_verified_findings = _coerce_string_list(parsed.get("verified_findings"))
    current_warnings = _coerce_string_list(parsed.get("warnings"))
    missing_areas = _coerce_string_list(parsed.get("missing_areas"))[:3]

    needs_more_research = bool(parsed.get("needs_more_research", False))

    if not current_verified_findings:
        current_verified_findings = [
            "The workflow gathered evidence but needs stronger source-backed findings before reporting.",
        ]
        needs_more_research = True

    stale_year_pattern = re.compile(r"\b2024\b|\b2025\b")
    stale_hits = [chunk for chunk in evidence_chunks if stale_year_pattern.search(chunk)]
    if stale_hits and not current_warnings:
        current_warnings.append("Evidence includes potentially stale year-specific references that should be checked against current sources.")

    if needs_more_research and not missing_areas:
        missing_areas = [f"Recent source-backed evidence for {state.get('topic', '')}"]

    accumulated_verified_findings = _dedupe_strings(
        _coerce_string_list(state.get("verified_findings")) + current_verified_findings
    )
    accumulated_warnings = _dedupe_strings(
        _coerce_string_list(state.get("warnings")) + current_warnings
    )

    iteration = state.get("iteration", 0)
    max_iterations = state.get("max_iterations", 2)
    if iteration >= max_iterations:
        needs_more_research = False
        missing_areas = []

    print("verifier end")

    return {
        "verified_findings": accumulated_verified_findings,
        "warnings": accumulated_warnings,
        "needs_more_research": needs_more_research,
        "missing_areas": missing_areas,
    }


def report_node(state):
    print("report start")

    prompt = f"""
TOPIC:
{state.get('topic', '')}

CURRENT DATE:
{state.get('current_date', today)}

RESEARCH PLAN:
{state.get('research_plan', '')}

VERIFIED FINDINGS:
{chr(10).join(f'- {item}' for item in state.get('verified_findings', []))}

WARNINGS:
{chr(10).join(f'- {item}' for item in state.get('warnings', []))}
"""

    final_output = _invoke_llm(
        f"{REPORT_PROMPT}\n\nCURRENT DATE: {state.get('current_date', today)}",
        prompt,
    )

    print("report end")

    return {
        "final_report": final_output,
    }