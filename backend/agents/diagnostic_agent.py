import json
from langchain_core.prompts import ChatPromptTemplate
from backend.agents import BaseAgent
from backend.utils import get_logger
from backend.config import MAX_QUES


class DiagnosticAgent(BaseAgent):
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)

        prompt = ChatPromptTemplate(
            messages=[
                (
                    "system",
                    "ROLE: You are an expert educational diagnostician who analyzes student assessment RESULTS to identify learning gaps and provide actionable recommendations.\n\n"

                    "TASK:\n"
                    "- Review the student's assessment performance.\n"
                    "- Check if the student has attempted all the given questions.\n"
                    "- Count how many answers are correct and how many are incorrect.\n"
                    "- Assume the assessment already covers Listening, Grasping, Retention, and Application.\n"
                    "- Based on overall correctness and patterns (without solving the questions), estimate the student's strengths and weaknesses in these four aspects.\n"
                    "- Provide a short diagnosis (50-100 words) highlighting strong and weak areas.\n"
                    "- Provide practical and specific recommendations (50-100 words) to improve weaker areas.\n\n"

                    "GUIDELINES:\n"
                    "- Do NOT attempt to solve the questions yourself.\n"
                    "- Only use the provided RESULTS for evaluation.\n"
                    "- Scores for Listening, Grasping, Retention, and Application must each be an integer 0-100, treated as independent indicators.\n"
                    "- The scores do NOT need to sum to 100.\n"
                    "- If all questions are correct, all categories should score high.\n"
                    "- If some are incorrect, reflect possible weaknesses proportionally.\n"
                    "- Keep tone supportive and constructive.\n"
                    "- Output must strictly follow JSON schema.\n"
                    "- Do not include any other text outside JSON.\n\n"

                    "OUTPUT:\n"
                    "Return only a JSON object with the following keys:\n"
                    "{{\n"
                    '  "diagnosis": "string",\n'
                    '  "recommendations": "string",\n'
                    '  "listening": int,\n'
                    '  "grasping": int,\n'
                    '  "retention": int,\n'
                    '  "application": int\n'
                    "}}\n"
                ),
                (
                    "human",
                    "STUDENT NAME: {name}\n\nRESULTS: {results}\n\nSCORE: {score} out of {max_ques}"
                )
            ]
        )

        super().__init__(
            name= 'diagnostic',
            instructions= prompt,
            temperature= 0.0,
            use_small_model= True
        )

        self.logger.info('Diagnostic Agent Initialized.')


    def run(self, state):
        if state.get('assessment_results') is None:
            self.logger.error('No value for `assessment_results` was provided.')
            raise ValueError('No value for `assessment_results` was provided.')
        
        name = state.get('name')
        tags = state.get('tags')

        try:
            # Diagnosing assessment
            self.logger.info(f'Diagnosing assessment of Student: {name}, on Tags: {tags} ...')
            diagnosis = self.llm.invoke(
                self.instructions.format_messages(
                    name= name, 
                    results= json.dumps(state.get('assessment_results')),
                    score= state.get('total_score'), 
                    max_ques= MAX_QUES
                )
            ).content.strip()
            self.logger.info('LLM response received.')

            json_output = json.loads(diagnosis)
            self.logger.info('Successfully parsed JSON from the LLM response.')
            
            self.logger.info(f'Successfully diagnosed assessment of Student: {name}, on Tags: {tags}.')
            return {'diagnosis': json_output}
        
        except json.JSONDecodeError as e:
            self.logger.error(f'Failed to parse LLM response as JSON: {e}')
            self.logger.debug(f'Raw LLM output:\n{diagnosis}')
