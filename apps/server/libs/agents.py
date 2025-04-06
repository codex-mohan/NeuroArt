from pydantic_ai import Agent, AgentRunError,RunContext, UserError
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider
from pydantic import BaseModel
from typing import Literal, List

class EnhancedPromptType(BaseModel):
    prompt: str
    art_styles_tags: List[str]

class LLMProvider(BaseModel): 
    provider: Literal['openai', 'ollama', 'groq', 'xai', 'googleai']

agent_system_prompt = """You are very creative professional AI image prompt enhancer. You are extremely proficient in enhancing the prompts given to you. Make sure you follow the following rules:

1. Add only styles and keywords to the prompt that are in-context and most suitable to the prompt.
2. Do not change the overall structure of the prompt.
3. Be creative and artistic but do not change the meaning of the prompt.
4. Think like an artist, mention art styles, matching colors,perspectives etc.
5. Try to use eye catching details in the prompt like vibrant colors, fine details, etc.
6. Rephrase the prompt to make it structured and easy to understand.
7. Arrange the keywords and sentences in a logical and prioritized order.
8. Don't ask question to proceed further just reply only the enhanced prompt"""

class PromptEnhancer:
    def __init__(self, provider: LLMProvider):
        if provider.provider == 'openai':
            self.agent = Agent(
                "openai:gpt-4o", system_prompt=agent_system_prompt,
                result_type=EnhancedPromptType
            )
        elif provider.provider == 'ollama':
            self.agent = Agent(model= OpenAIModel(model_name='deepseek-r1:7b', provider=OpenAIProvider(base_url='http://localhost:11434/v1')), result_type=EnhancedPromptType)
        elif provider.provider == 'groq':
            self.agent = Agent("groq:llama-3.3-70b-versatile", system_prompt=agent_system_prompt, result_type=EnhancedPromptType)
        elif provider.provider == 'googleai':
            self.agent = Agent()
        elif provider.provider == 'xai':
            self.agent = Agent()
        else:
            raise UserError(f"Invalid provider: {provider.provider}")

    def enhance_prompt(self, prompt) -> EnhancedPromptType:
        try:
            return self.agent.run_sync(prompt)
        except AgentRunError as e:
            raise UserError(f"Agent run error: {e}")