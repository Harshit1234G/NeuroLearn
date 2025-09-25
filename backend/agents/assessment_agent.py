import pandas as pd
from typing import Any, Dict, Tuple

from backend.agents import StudentState
from backend.utils import get_logger
from backend.config import CSV_PATH, MAX_QUES


class AssessmentAgent:
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)
        try:
            self.dataset = pd.read_csv(CSV_PATH)
            self.logger.info(f'Successfully loaded the dataset from {CSV_PATH}.')
        
        except FileNotFoundError as e:
            self.logger.error(f'Dataset file not found: {CSV_PATH}. Error: {e}')

        except pd.errors.EmptyDataError as e:
            self.logger.error(f'Dataset file is empty: {CSV_PATH}. Error: {e}')

        self.logger.info('Assessment Agent Initialized.')


    def _get_question(self, state: StudentState) -> dict[str, Any]:
        difficulty = self._decide_difficulty(state.get('current_difficulty', 0))

        filtered_df = self.dataset.loc[
            (self.dataset['difficulty'] == difficulty) & 
            (self.dataset['tags'] == state.get('tags')) &
            (~self.dataset['id'].isin(state.get('already_asked', [])))
        ]

        if filtered_df.empty:
            self.logger.warning('Filtered dataframe was empty. Falling back to the entire dataset.')
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
            self.logger.info(f'Increased diffculty level from {current_level} to {level}.')

        else:
            level = max(current_level - down, 0)
            self.logger.info(f'Decreased diffculty level from {current_level} to {level}.')

        return level
    

    def _decide_difficulty(self, level: int) -> str:
        if level <= 2:
            difficulty = 'Very easy'
        
        elif level <= 5:
            difficulty = 'Easy'
        
        elif level <= 8:
            difficulty = 'Moderate'
        
        elif level <= 10:
            difficulty = 'High'

        self.logger.info(f'Mapped numeric level [{level}] to difficulty: {difficulty}')
        return difficulty
    

    def _ask_question(
            self, 
            que_num: int, 
            que: Dict[str, Any]
        ) -> Tuple[str, bool]:
        try:
            print(f'\nQuestion {que_num}: {que['question_text']}\n')
            print(f'A. {que['option_a']:<20}B. {que['option_b']}')
            print(f'C. {que['option_c']:<20}D. {que['option_d']}\n')

            answer = input('Answer: ').strip().lower()
            status = answer == que['answer'].lower()   # added lower(), because of dataset incosistency

            print(f'\nResult: {"Correct" if status else "Wrong"}\n')
            return answer, status
        
        except KeyError as e:
            self.logger.error(f'Missing field in question dict: {e}')

        except Exception as e:
            self.logger.error(f'Unexpected error while asking question: {e}')
    

    def _assess(self, state: StudentState) -> StudentState:
        self.logger.info(f'Starting assessment for student: {state.get('name')} on tag: {state.get('tags')}')

        assessment_results = []
        score = 0

        try: 
            for i in range(MAX_QUES):
                que = self._get_question(state)
                state.setdefault('already_asked', []).append(que['id'])

                answer, status = self._ask_question(i + 1, que)

                if status:
                    score += 1

                # update difficulty
                state['current_difficulty'] = self._change_difficulty_level(
                    state.get('current_difficulty', 0), 
                    correct= status
                )

                que['student_answer'] = answer
                que['status'] = "Correct" if status else "Wrong"
                assessment_results.append(que)

            # finalize
            state['assessment_results'] = assessment_results
            state['total_score'] = score

            self.logger.info(f'Completed assessment for student: {state.get('name')}, Tag: {state.get('tags')}, Score: {score}/{MAX_QUES}.')
            return state
        
        except Exception as e:
            self.logger.error(f'Error during assessment: {e}')

        
    def run(self, state: StudentState) -> StudentState:
        self.logger.info('Assessment Agent started.')
        updated_state = self._assess(state)
        self.logger.info('Assessment Agent finished successfully.')
        return updated_state
