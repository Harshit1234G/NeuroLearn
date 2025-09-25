import pandas as pd
from typing import Any

from backend.agents import StudentState
from backend.utils import get_logger
from backend.config import CSV_PATH, MAX_QUES


class AssessmentAgent:
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)
        self.dataset = pd.read_csv(CSV_PATH)
        self.logger.info('Successfully loaded the dataset.')
        self.logger.info('Assessment Agent Initialized.')


    def _get_question(self, state: StudentState) -> dict[str, Any]:
        difficulty = self._decide_difficulty(state.get('current_difficulty'))

        filtered_df = self.dataset.loc[
            (self.dataset['difficulty'] == difficulty) & 
            (self.dataset['tags'] == state.get('tags')) &
            (~self.dataset['id'].isin(state.get('already_asked')))
        ]

        if filtered_df.empty:
            self.logger.info('filtered_df was empty.')
            filtered_df = self.dataset

        row = filtered_df.sample(n= 1).iloc[0]

        self.logger.info(f'Successfully selected a question, ID: {row['id']}.')
        return row.to_dict()


    def _change_difficulty_level(
            self, 
            current_level: int, 
            correct: bool,
            *,
            up: int = 2,
            down: int = 1
        ) -> int:
        if correct:
            level = min(current_level + up, 10)

        else:
            level = max(current_level - down, 0)

        self.logger.info(f'Difficulty level: {level}.')
        return level
    

    def _decide_difficulty(self, level: int) -> str:
        if level >= 0 and level <= 3:
            difficulty = 'Very easy'
        
        elif level > 3 and level <= 5:
            difficulty = 'Easy'
        
        elif level > 5 and level <= 8:
            difficulty = 'Moderate'
        
        elif level > 8 and level <= 10:
            difficulty = 'High'

        self.logger.info(f'Decided diffculty: {difficulty}')
        return difficulty
    

    def _assess(self, state: StudentState) -> StudentState:
        assessment_results = []
        score = 0

        for i in range(MAX_QUES):
            que = self._get_question(state)
            state['already_asked'].add(que['id'])

            print(f'Question {i + 1}: {que['question_text']}\n')
            print(f'A. {que['option_a']:<20}B. {que['option_b']}\n')
            print(f'C. {que['option_c']:<20}D. {que['option_d']}\n')
            answer = input('\nAnswer: ').strip().lower()

            status = answer == que['answer']
            print(f'\nResult: {"Correct" if status else "Wrong"}\n')

            if status:
                score += 1

            state['current_difficulty'] = self._change_difficulty_level(state['current_difficulty'], correct= status)

            que['student_answer'] = answer
            que['status'] = "Correct" if status else "Wrong"
            assessment_results.append(que)

        state['assessment_results'] = assessment_results
        state['total_score'] = score

        self.logger.info(f'Successfully completed the assessment of {state.get('name')} on `{state.get('tags')}`.')
        return state

        
    def run(self, state: StudentState) -> StudentState:
        self.logger.info('Assessment Agent started.')
        updated_state = self._assess(state)
        return updated_state
