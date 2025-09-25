import json
from langchain_core.prompts import ChatPromptTemplate
from backend.agents import BaseAgent
from backend.utils import get_logger


class ReportAgent(BaseAgent):
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)

        prompt = ChatPromptTemplate(
            messages= [
                (
                    "system",
                    "ROLE: You are an expert educational report writer who generates personalized reports for students, teachers, and parents based on diagnostic results.\n\n"

                    "TASK: You will be given a student's DIAGNOSIS and RECOMMENDATIONS. Create 3 separate reports one for the student, one for the teacher, and one for the parent.\n\n"

                    "REPORT REQUIREMENTS:\n"
                    "1. Student Report:\n"
                    "- Address the student directly using 'you'.\n"
                    "- Be descriptive and motivational, written like a story or game-style narrative.\n"
                    "- Clearly explain strengths and weaknesses.\n"
                    "- Encourage the student that challenges can be overcome with effort.\n"
                    "- Use engaging markdown structure: headings, bullet points, short paragraph.\n\n"

                    "2. Teacher Report:\n"
                    "- Keep it concise and informative.\n"
                    "- Focus on student's observed strengths, weaknesses, and teaching implications.\n"
                    "- Written in professional tone, minimal fluff.\n"
                    "- Use markdown with short bullet points.\n\n"

                    "3. Parent Report:\n"
                    "- Explain how parents can support the student at home.\n"
                    "- Provide actionable suggestions (e.g., study routines, practice, encouragement).\n"
                    "- Tone: supportive, guiding, and positive.\n"
                    "- Use markdown with headings and bullet points.\n\n"

                    "GUIDELINES:\n"
                    "- Do NOT repeat the raw diagnosis and recommendations word-for-word.\n"
                    "- Reframe them appropriately for each audience.\n"
                    "- Maintain positivity, avoid harsh criticism.\n"
                    "- All reports must be returned as a JSON object with three keys: student_report, teacher_report, parent_report.\n"
                    "- Each report value must be in proper Markdown format (with headings, lists, etc.).\n"
                    "- Do NOT include any text outside the JSON.\n\n"

                    "OUTPUT FORMAT:\n"
                    "{{\n"
                    '   "student_report": "string",\n'
                    '   "teacher_report": "string",\n'
                    '   "parent_report": "string",\n'
                    "}}\n"
                ),
                ("human", "STUDENT NAME: {name}\n\nDIAGNOSIS: {diagnosis}\n\nRECOMMENDATIONS: {recommendations}")
            ]
        )

        super().__init__()
