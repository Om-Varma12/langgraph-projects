from prompts.prompt import LEAD_AGENT_PROMPT
from tools.subagent_spawner import spawn_sub_agent
from langchain_groq import ChatGroq
from langchain.agents import create_agent
from dotenv import load_dotenv
load_dotenv()


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)
lead_agent = create_agent(
    model=llm,
    tools=[spawn_sub_agent]
)

def lead_agent_node(state):
    print("lead agent start")
    
    topic = state["topic"]

    prompt = f"""
    {LEAD_AGENT_PROMPT}

    USER RESEARCH TOPIC:
    {topic}
    """

    result = lead_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
    )

    final_output = result["messages"][-1].content

    print("lead agent end")

    return {
        "final_report": final_output
    }