from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_groq import ChatGroq

from tools.web_search import web_search
from config.settings import MODEL_BIG
from state.todo import TODO
load_dotenv()

tools = [web_search]

model = ChatGroq(
    model=MODEL_BIG,
    reasoning_effort='none',
)

agent = create_agent(
    model=model,
    tools=tools
)
