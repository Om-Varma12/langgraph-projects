from langchain_groq import ChatGroq
from langchain_tavily import TavilySearch
from langchain.agents import create_agent
from langchain_core.tools import tool
from prompts.prompt import SUB_AGENT

from dotenv import load_dotenv
load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)


web_search = TavilySearch(max_results=2)


@tool
def spawn_sub_agent(task: str, precise_prompt: str) -> str:
    """
    Spawn a research sub-agent with web access.
    """

    print('sub agent spawned')
    print(task)
    print(precise_prompt)

    sub_agent = create_agent(
        model=llm,
        tools=[web_search],
        system_prompt=SUB_AGENT
    )

    result = sub_agent.invoke({
        "messages": [
            {
                "role": "user",
                "content": f"""
                    TASK:
                    {task}

                    SPECIFIC INSTRUCTIONS:
                    {precise_prompt}
                """
            }
        ]
    })


    return result["messages"][-1].content
    # return result