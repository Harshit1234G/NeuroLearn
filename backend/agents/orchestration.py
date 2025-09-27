from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from backend.agents import (
    StudentState,
    AssessmentAgent,
    DiagnosticAgent,
    ReportAgent,
    TutorAgent
)
from backend.utils import get_logger
from backend.config import MAX_QUES


class NeuroLearn:
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)

        # initialize agents
        assessment = AssessmentAgent()
        diagnostic = DiagnosticAgent()
        report = ReportAgent()
        tutor = TutorAgent()

        # building graph
        builder = StateGraph(StudentState)

        # adding nodes
        builder.add_node(assessment.name, assessment.run)
        builder.add_node(diagnostic.name, diagnostic.run)
        builder.add_node(report.name, report.run)
        builder.add_node(tutor.name, tutor.run)

        # adding edges and coditional edges
        builder.set_entry_point(assessment.name)
        builder.add_conditional_edges(
            assessment.name,
            self._is_all_correct,
            {
                True: report.name,
                False: diagnostic.name
            }
        )
        builder.add_edge(diagnostic.name, report.name)
        builder.add_conditional_edges(
            report.name,
            self._is_all_correct,
            {
                True: END,
                False: tutor.name
            }
        )
        builder.set_finish_point(tutor.name)

        # compiling graph
        self.memory = MemorySaver()
        self.graph = builder.compile(checkpointer= self.memory)
        self.logger.info('Graph compilation successfull, NeuroLearn Initialized.')


    def _is_all_correct(self, state: StudentState) -> bool:
        con = MAX_QUES == state.get('total_score', 0)
        self.logger.info(f'Are all answers correct: {con}')
        return con
    

    def run(self, student_name: str, tags: str) -> StudentState:
        try:
            state = state = {
                'name': student_name,
                'tags': tags,
                'already_asked': [],
                'current_difficulty': 2
            }
            state = self.graph.invoke(
                state,
                config= {
                    'configurable': {'thread_id': f'{student_name}_{tags}'}
                }
            )

            return state
        
        except Exception as e:
            self.logger.exception(f'Error during the workflow: {e}')
