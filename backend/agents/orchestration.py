import os
from time import perf_counter
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from backend.agents import (
    StudentState,
    AssessmentAgent,
    DiagnosticAgent,
    ReportAgent,
    TutorAgent
)
from backend.utils import get_logger, save_state, create_pdf
from backend.config import MAX_QUES, CACHE_DIR, REPORTS_DIR, NOTES_DIR


class NeuroLearn:
    def __init__(self, *, cli: bool = True):
        self.logger = get_logger(self.__class__.__name__)
        self.cli = cli

        # initialize agents
        diagnostic = DiagnosticAgent()
        report = ReportAgent()
        tutor = TutorAgent()

        # building graph
        builder = StateGraph(StudentState)

        # adding nodes
        builder.add_node(diagnostic.name, diagnostic.run)
        builder.add_node(report.name, report.run)
        builder.add_node(tutor.name, tutor.run)

        # adding edges and coditional edges
        if self.cli:
            assessment = AssessmentAgent()
            builder.add_node(assessment.name, assessment.run)

            builder.set_entry_point(assessment.name)
            builder.add_conditional_edges(
                assessment.name,
                self._is_all_correct,
                {
                    True: report.name,
                    False: diagnostic.name
                }
            )

        else:
            builder.set_entry_point(diagnostic.name)

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
    

    def _run_cli(self, student_name: str, tags: str) -> StudentState:
        self.logger.info(f'Workflow started for {student_name} on topic "{tags}".')

        start_time = perf_counter()
        thread_id = f'{student_name}_{tags}'

        # initial state setup
        state = self._initialize_state(student_name, tags)

        try:
            # executing workflow
            state = self.graph.invoke(
                state,
                config= {'configurable': {'thread_id': thread_id}}
            )

            # Saving final results
            self._finalize_workflow(state, student_name, tags)

            elapsed = perf_counter() - start_time
            minutes, seconds = divmod(elapsed, 60)
            self.logger.info(
                f'Workflow completed in {int(minutes)}m {seconds:.2f}s.'
            )

            return state

        except Exception as e:
            self.logger.exception(f'Error during workflow execution: {e}')

            # Saving intermediate state for debugging/recovery
            partial_state = self.graph.get_state(
                config= {'configurable': {'thread_id': thread_id}}
            )
            save_state(partial_state, student_name)
            self.logger.info(f'Saved partial state at .{CACHE_DIR}/')

            return partial_state


    def _initialize_state(self, student_name: str, tags: str) -> dict:
        return {
            'name': student_name,
            'tags': tags,
            'already_asked': [],
            'current_difficulty': 2,
            # baseline diagnosis (overwritten later by DiagnosticAgent)
            'diagnosis': {
                'diagnosis': f"{student_name} demonstrates strong performance across all assessment aspects, achieving a perfect score. Their ability to listen, grasp, retain, and apply knowledge is evident, particularly in handling {tags}-related problems, which suggests a solid understanding of concepts.",
                'recommendations': f"To maintain and further enhance their skills, {student_name} should engage in more complex problem-solving scenarios that challenge their application of concepts in real-world contexts. Additionally, exploring advanced topics in {tags} and related areas can help deepen their understanding and prepare them for future assessments.",
                'listening': 100,
                'grasping': 100,
                'retention': 100,
                'application': 100,
            },
        }


    def _finalize_workflow(self, state: StudentState, student_name: str, tags: str) -> None:
        save_state(state, student_name)
        self.logger.info(f'Final state saved at .{CACHE_DIR}/')

        # checking if directories exist
        os.makedirs(REPORTS_DIR, exist_ok= True)
        os.makedirs(NOTES_DIR, exist_ok= True)

        # genearting reports pdf
        reports = state.get('reports')
        if reports:
            for audience, content in reports.items():
                filename = os.path.join(REPORTS_DIR, f'{student_name}_{audience}.pdf')
                self.logger.info(f'Generating PDF report for: {audience}')
                create_pdf(content, filename)

        # tutor notes pdf
        tutor_notes = state.get('tutor_notes')
        if tutor_notes:
            filename = os.path.join(NOTES_DIR, f'{student_name}_{tags}.pdf')
            self.logger.info('Generating PDF for: Tutor Notes')
            create_pdf(tutor_notes, filename)


    def _run_web(self, student_name: str, tags: str) -> StudentState:
        raise NotImplementedError('This functionality is not implemented yet.')


    def run(self, student_name: str, tags: str) -> StudentState:
        if self.cli:
            return self._run_cli(student_name, tags)
        
        return self._run_web(student_name, tags)
