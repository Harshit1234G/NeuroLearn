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


    def _get_question(self, difficulty: str, tags: str) -> dict[str, Any]:
        filtered_df = self.dataset.loc[
            (self.dataset['difficulty'] == difficulty)
            & 
            (self.dataset['tags'] == tags)
        ]
        row = filtered_df.sample(n= 1).iloc[0]

        self.logger.info(f'Successfully selected a question, ID: {row['id']}.')

        return row.to_dict()


    def _change_difficulty_level(self, current_level: int, *, correct: bool = True) -> int:
        if correct:
            current_level += 2

        else:
            current_level -= 1

        level = current_level if current_level <= 10 else 10
        self.logger.info(f'Difficulty level: {level}.')

        return level
    

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
        self.logger.info('Assessment Agent started.')

        for i in range(MAX_QUES):
            difficulty = self._decide_difficulty(state.get('current_difficulty', 2))
            self.logger.info(f'Decided difficulty: {difficulty}')

            que = self._get_question(difficulty, state.get('tags'))
            state['already_asked'].append(que['id'])

            print(f'Question {i + 1}: {que['question_text']}\n')
            print(f'A. {que['option_a']:<20}B. {que['option_b']}\n')
            print(f'C. {que['option_c']:<20}D. {que['option_d']}\n')
            answer = input('\nAnswer: ').strip().lower()

            status = answer == que['answer']

            print(f'\nResult: {"Pass" if status else "Fail"}\n')
            state['current_difficulty'] = self._change_difficulty_level(state['current_difficulty'], correct= (status))
