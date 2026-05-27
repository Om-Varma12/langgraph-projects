# Autonomous Web Research Agent

An automated web research workflow built with LangGraph, Groq, Tavily, and Trafilatura. The current graph follows a bounded loop of planning, searching, summarizing, and final report generation.

## Features

- Generates search queries from a user-defined topic
- Searches the web with Tavily and extracts readable page content
- Summarizes findings with an LLM-powered research loop
- Produces a final consolidated report
- Stops automatically when the research is marked complete or the maximum iteration limit is reached

## Requirements

- Python 3.13 or newer
- A Groq API key
- A Tavily API key

## Installation

### Option 1: Using `uv` recommended

1. Change into the backend directory:

```bash
cd autonomous-web-research-agent/backend
```

2. Create and activate a virtual environment if needed:

```bash
uv venv
```

On Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

On Windows Command Prompt:

```cmd
.venv\Scripts\activate.bat
```

3. Install dependencies:

```bash
uv sync
```

### Option 2: Using `pip`

1. Change into the backend directory:

```bash
cd autonomous-web-research-agent/backend
```

2. Create and activate a virtual environment:

```bash
python -m venv .venv
```

3. Activate it:

On Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

On Windows Command Prompt:

```cmd
.venv\Scripts\activate.bat
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in the backend directory and add the required API keys:

```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

The application loads environment variables automatically with `python-dotenv`, so no extra configuration is required after creating the file.

## Running the Research Workflow

The current runnable demo entrypoint is `tests/main.py`.

```bash
python tests/main.py
```

This script initializes the research state, runs the LangGraph workflow, and prints the final report to the console.

## Project Structure

```text
backend/
├── graph/
│   ├── builder.py      # LangGraph workflow definition
│   ├── nodes.py        # Planner, search, summarizer, and report nodes
│   ├── state.py        # Shared graph state schema
│   └── visual.py       # Utility for rendering the graph
├── prompts/
│   └── prompt.py      # Planner prompt template
├── tools/
│   └── web_search.py   # Tavily search and webpage scraping helpers
├── tests/
│   └── main.py         # Runnable demo entrypoint
├── main.py             # Placeholder application entrypoint
├── pyproject.toml      # Project metadata and dependencies
├── requirements.txt    # Pip dependency list
└── README.md
```

## How It Works

1. The planner generates search queries for the topic.
2. The searcher sends those queries to Tavily and scrapes the top results.
3. The summarizer compresses the research results into findings and decides whether more research is needed.
4. The graph either loops back for another iteration or generates a final report.

## Notes

- The workflow currently uses a fixed maximum iteration limit of 5.
- Search and report generation are both LLM-assisted, so output quality depends on the model and source quality.
- `main.py` is currently a placeholder; use `tests/main.py` to execute the graph.

## Troubleshooting

- If you see authentication errors, verify that `GROQ_API_KEY` and `TAVILY_API_KEY` are set correctly in `.env`.
- If dependencies fail to install, confirm that your Python version is 3.13 or newer.
- If web scraping returns empty content, the target pages may block extraction or require JavaScript rendering.

## Suggested Next Improvements

- Add a real CLI entrypoint for production use
- Persist research state between runs
- Add source citations to the final report
- Replace the simple completion check with a structured verifier step
