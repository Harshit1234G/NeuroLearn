from langchain_core.prompts import ChatPromptTemplate
from backend.agents import BaseAgent
from backend.utils import get_logger


class ReportAgent(BaseAgent):
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)

        prompt = ChatPromptTemplate(
            messages= [
                (
                    'system',
                    'ROLE: You are a professional educational report writer with expertise in creating different perspectives of same report.\n'
                    'TASK: Write three versions (Student, Teacher, and Parent) of the given DIAGNOSIS of a student assessment.\n'
                    'GUIDELINES:\n'
                    '- Explain and clarify the DIAGNOSIS as different perspectives/tones:\n'
                    '   - Student: Maintain an encouraging and supportive tone, '
                )
            ]
        )

        super().__init__()
