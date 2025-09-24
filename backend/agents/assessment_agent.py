import pandas as pd
from typing import Any

from backend.agents import StudentState
from backend.utils import get_logger
from backend.config import CSV_PATH, MAX_QUES


class AssessmentAgent:
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)
        self.dataset = pd.read_csv(CSV_PATH)
        self.logger.info('Assessment Agent Initialized.')


    def _get_question(self) -> dict[str, Any]:
        ...


    def _change_difficulty_level(self, current_level: int, *, correct: bool = True) -> int:
        if correct:
            current_level += 2

        else:
            current_level -= 1

        return current_level if current_level <= 10 else 10
    

    def _decide_difficulty(self, level: int) -> str:
        if level > 0 and level <= 3:
            return 'Very easy'
        
        if level > 3 and level <= 5:
            return 'Easy'
        
        if level > 5 and level <= 8:
            return 'Moderate'
        
        if level > 8 and level <= 10:
            return 'High'

        
    def run(self, state: StudentState) -> StudentState:
        for i in range(MAX_QUES):
            if state.get('current_difficulty') < 0:
                return
