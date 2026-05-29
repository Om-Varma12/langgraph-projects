from tools.subagent_spawner import spawn_sub_agent

# for functions written as tools, we would have to use 'invoke' keyword to invoke those
print(
    spawn_sub_agent.invoke({
        "task": "latest openai news and comparison with anthropic",
        "precise_prompt": """
        Research:
        - latest OpenAI updates
        - latest Anthropic updates
        - compare both companies
        """
    })
)