from typing_extensions import TypedDict
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from backend.config import DEFAULT_MODEL, SMALL_MODEL


class StudentState(TypedDict):
    name: str
    topics: list[str]
    results: ...
    diagnosis: str
    reports: dict[str, str]

class BaseAgent:
    def __init__(
            self, 
            name: str, 
            instructions: ChatPromptTemplate, 
            temperature: float,
            *, 
            use_small_model: bool = False,
            **llm_kwargs
        ) -> None:
        """
        Base class for creating agents. Initializes basic attributes, selects small or default model, and creates an object of `langchain_openai.ChatOpenAI` based on the given LLM arguments.

        Args:
            name (str): Name of the agent.
            instructions (ChatPromptTemplate): Prompt for the LLM.
            temperature (float): Temperature for the LLM.
            use_small_model (bool, optional): If True then the agent will use smaller model from the `config/settings.py`. Defaults to False.
            llm_kwargs: Any other keyword arguments for the LLM.
        """
        # basic attributes
        self.name = name
        self.instructions = instructions
        self.temperature = temperature
        self.model = SMALL_MODEL if use_small_model else DEFAULT_MODEL

        # core components
        self.llm = ChatOpenAI(
            model= self.model,
            temperature= self.temperature,
            **llm_kwargs
        )


    def run(self, state: StudentState) -> StudentState:
        """Every child class should implement this function. It is used as graph node later.

        Args:
            state (StudentState): State for the graph.

        Raises:
            NotImplementedError: Every child class must implement `run()` function.

        Returns:
            StudentState: Child classes should return `StudentState`.
        """
        raise NotImplementedError('Subclasses must implement run()')
