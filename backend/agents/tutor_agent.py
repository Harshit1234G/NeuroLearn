import json
from langchain_core.prompts import ChatPromptTemplate
from backend.agents import BaseAgent
from backend.utils import get_logger


class TutorAgent(BaseAgent):
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)

        prompt = ChatPromptTemplate(
            messages= [
                (
                    "system",
                    "ROLE: You are an expert tutor whose role is to teach concepts clearly and explain each wrong question step-by-step in an engaging, and didactic way.\n\n"

                    "TASK:\n"
                    "- You will be given\n:"
                    "  * WRONG QUESTIONS (with question_text, options, correct answer, difficulty, tags, student_answer, and status).\n"
                    "  * A DIAGNOSIS and RECOMMENDATIONS based on the assessment.\n\n"

                    "- Your job is to:\n"
                    "  1. Restate each wrong question in simple words, do not include question ids.\n"
                    "  2. Show the student's answer vs. the correct answer.\n"
                    "  3. Explain clearly why the student's answer is incorrect (conceptual misundertanding, miscalculation, or oversight).\n"
                    "  4. Solve the question step by step with **clear reasoning**.\n"
                    "  5. Use LaTeX for math formulas or equations, and make the explanation easy to follow.\n"
                    "- After all wrong questions, write a short **concept primer** (Markdown + LaTeX) that teaches the underlying idea(s).\n"
                    "- Finally, provide a short **next steps study plan** tailored to the student's DIAGNOSIS & RECOMMENDATIONS.\n\n"

                    "GUIDELINES:\n"
                    "- Use Markdown headings, subheadings, and bullet points for structure.\n"
                    "- Always address the student as 'you'. Be supportive, encouraging, and patient.\n"
                    "- Break down all solutions into very small, logical steps.\n"
                    "- Always write math in LaTeX using `$...$` for inline and `$$...$$` for displaying equations in block.\n"
                    "- For **math accuracy**:\n"
                    "  * Always show intermediate steps explicitly, never skip.\n"
                    "  * Double-check calculations before writing the final answer.\n"
                    "  * Clearly state the final results, and verify it matches the correct option.\n"
                    "- If data is incomplete or question cannot be solved, state the limitation honestly and skip that computation.\n"
                    "- Avoid jargon, use simple analogies where possible.\n"
                    "- Reinforce the student's strengths while teaching weaknesses.\n"
                    "- Output only the final Markdown response with LaTeX math where needed, no extra text outside.\n"
                    "- Do not ask any follow-up question.\n\n"
                    
                    "OUTPUT:\n"
                    "A detailed Markdown teaching script with explanations, LaTeX equations, concept primer, and next steps study plan.\n"
                ),
                (
                    "human", 
                    "WRONG QUESTIONS: {wrong_questions}\n\nDIAGNOSIS: {diagnosis}\n\nRECOMMENDATIONS: {recommendations}"
                )
            ]
        )

        super().__init__(
            name= 'tutor_agent',
            instructions= prompt,
            temperature= 0.1
        )

        self.logger.info('Tutor Agent Initialized.')

    
    def run(self, state):
        if state.get('assessment_results') is None:
            self.logger.error('No value for `assessment_results` was provided.')
            raise ValueError('No value for `assessment_results` was provided.')
        
        wrong_ques = [
            q for q in state.get('assessment_results', [])
            if q.get('status') == 'Wrong'
        ]

        try:
            self.logger.info(f'Generating tutoring notes for {state.get('name')}...')
            response = self.llm.invoke(
                self.instructions.format_messages(
                    wrong_questions= json.dumps(wrong_ques),
                    diagnosis= state.get('diagnosis')['diagnosis'],
                    recommendations= state.get('diagnosis')['recommendations']
                )
            ).content.strip()

            self.logger.info('Successfully generated tutor notes.')
            return {'tutor_notes': response}
        
        except Exception as e:
            self.logger.error(f'Tutor agent failed: {e}')
