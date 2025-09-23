from langchain_core.prompts import ChatPromptTemplate
from backend.agents import BaseAgent
from backend.utils import get_logger


class DiagnosticAgent(BaseAgent):
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)

        prompt = ChatPromptTemplate(
            messages= [
                (
                    'system', 
                    'ROLE: You are an expert educational diagnostician who analyzes student assessment RESULTS to indentify learning gaps and provide actionable recommendations.\n'

                    'TASK:\n'
                    "- Review student's performance on these aspects: Listening, Grasping, Retention, and Application.\n"
                    '- Identify which aspects are weak, which are strong, and explain the patterns.\n'
                    "- Generate a concise diagnosis of student's learning challenges.\n"
                    '- Provide targeted suggestions for improvement in weak areas with practical strategy.\n'

                    'GUIDELINES:\n'
                    '- Be clear, concise, student/teacher friendly, and avoid jargon.\n'
                    "- Always explain possible causes of student's weaknesses.\n"
                    '- Provide specific, constructive next steps instead of generic advice.\n'
                    '- Maintain an encouraging, supportive tone.\n'

                    'OUTPUT: A single paragraph of diagnosis and recommendations, word limit: 60 - 100 words, no other text.'
                ),
                ('human', 'RESULTS: {results}')
            ]
        )

        super().__init__(
            name= 'diagnostic',
            instructions= prompt,
            temperature= 0.3,
            use_small_model= True
        )

        self.logger.info('Diagnostic Agent Initialized.')


    def run(self, state):
        if state.get('results') is None:
            self.logger.error('No value for results was provided.')
            raise ValueError('No value for results was provided.')
        
        name = state.get('name', 'Unknown')
        topics = ", ".join(state.get('topics', []))

        # diagnosis llm call
        self.logger.info(f'Diagnosing assessment of Student: {name}, on Topics: {topics} ...')
        diagnosis = self.llm.invoke(
            self.instructions.format_messages(results= state['results'])
        ).content.strip()
        self.logger.info(f'Successfully diagnosed assessment of Student: {name}, on Topics: {topics}.')

        return {'diagnosis': diagnosis}
