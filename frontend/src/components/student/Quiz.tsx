import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockQuestions, mockQuizResults } from '../../data/mockData';
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Question, QuizResult } from '../../types';

const Quiz: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeStarted, setTimeStarted] = useState<Date>(new Date());
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get questions for the selected topic
  const questions = mockQuestions.filter(q => 
    q.topic.toLowerCase() === topic?.toLowerCase()
  ).slice(0, 10);

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/practice');
    }
  }, [questions.length, navigate]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (!user) return;

    const timeEnded = new Date();
    const timeSpent = Math.floor((timeEnded.getTime() - timeStarted.getTime()) / 1000);

    // Calculate results
    const answers = questions.map((question, index) => ({
      questionId: question.id,
      selectedAnswer: selectedAnswers[index] ?? -1,
      isCorrect: selectedAnswers[index] === question.correctAnswer
    }));

    const score = answers.filter(a => a.isCorrect).length;

    // Create result object
    const result: QuizResult = {
      id: Date.now().toString(),
      studentId: user.id,
      topic: questions[0].topic,
      score,
      totalQuestions: questions.length,
      answers,
      completedAt: timeEnded,
      timeSpent
    };

    // Add to mock results (in a real app, this would be an API call)
    mockQuizResults.push(result);
    
    setIsSubmitted(true);
    
    // Navigate to results page
    setTimeout(() => {
      navigate(`/results/${result.id}`);
    }, 1500);
  };

  const getAnsweredCount = () => {
    return Object.keys(selectedAnswers).length;
  };

  const getOptionClass = (optionIndex: number, isSelected: boolean) => {
    if (isSelected) {
      return 'border-blue-500 bg-blue-50 text-blue-900';
    }
    return 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50';
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Topic not found</h2>
          <p className="text-gray-600 mt-2">The requested topic doesn't exist or has no questions.</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Submitted Successfully!</h2>
          <p className="text-gray-600">Redirecting to results page...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentQ.topic} Quiz</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Started {timeStarted.toLocaleTimeString()}
            </div>
            <div className="text-sm">
              <span className="text-green-600 font-medium">{getAnsweredCount()}</span>
              <span className="text-gray-500">/{questions.length} answered</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Question {currentQuestion + 1}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              Difficulty: {currentQ.difficulty}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${getOptionClass(
                index,
                selectedAnswers[currentQuestion] === index
              )}`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-base">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors duration-200 ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : selectedAnswers[index] !== undefined
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={getAnsweredCount() < questions.length}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Submit Quiz
            <CheckCircle className="h-4 w-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={goToNext}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>

      {/* Warning for incomplete quiz */}
      {getAnsweredCount() < questions.length && currentQuestion === questions.length - 1 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Incomplete Quiz</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have {questions.length - getAnsweredCount()} unanswered questions. Please answer all questions before submitting.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;