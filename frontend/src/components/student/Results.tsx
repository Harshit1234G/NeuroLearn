import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockQuizResults, mockQuestions } from '../../data/mockData';
import { CheckCircle, XCircle, Clock, Trophy, Target, RotateCcw, Home } from 'lucide-react';

const Results: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();

  const result = mockQuizResults.find(r => r.id === resultId);

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Results not found</h2>
          <p className="text-gray-600 mt-2">The requested quiz results could not be found.</p>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const timeMinutes = Math.floor(result.timeSpent / 60);
  const timeSeconds = result.timeSpent % 60;

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Excellent work! Outstanding performance!", icon: "🌟" };
    if (percentage >= 80) return { message: "Great job! You're doing very well!", icon: "🎉" };
    if (percentage >= 70) return { message: "Good work! Keep it up!", icon: "👏" };
    if (percentage >= 60) return { message: "Not bad! Room for improvement.", icon: "💪" };
    return { message: "Keep practicing! You'll get better.", icon: "📚" };
  };

  const performanceMessage = getPerformanceMessage(percentage);

  // Get question details
  const questionsWithAnswers = result.answers.map(answer => {
    const question = mockQuestions.find(q => q.id === answer.questionId);
    return {
      ...answer,
      question
    };
  });

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
        <p className="text-gray-600">{result.topic} • Completed {new Date(result.completedAt).toLocaleDateString()}</p>
      </div>

      {/* Score Overview */}
      <div className={`rounded-lg border-2 p-8 mb-8 text-center ${getScoreBgColor(result.score, result.totalQuestions)}`}>
        <div className="mb-4">
          <div className={`text-6xl font-bold ${getScoreColor(result.score, result.totalQuestions)}`}>
            {percentage}%
          </div>
          <p className="text-xl text-gray-700 mt-2">
            {result.score} out of {result.totalQuestions} correct
          </p>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <span className="text-2xl mr-2">{performanceMessage.icon}</span>
          <p className="text-lg font-medium text-gray-700">{performanceMessage.message}</p>
        </div>
        
        <div className="flex justify-center space-x-8 mt-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Time Taken</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {timeMinutes}m {timeSeconds}s
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Accuracy</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{percentage}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Score</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {result.score}/{result.totalQuestions}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Question-by-Question Review</h3>
          <p className="text-sm text-gray-600 mt-1">Review your answers and see the correct solutions</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {questionsWithAnswers.map((item, index) => {
              if (!item.question) return null;
              
              return (
                <div key={item.questionId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-500">Question {index + 1}</span>
                    </div>
                    <div className="flex items-center">
                      {item.isCorrect ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Correct</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Incorrect</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="text-base font-medium text-gray-900 mb-3">
                    {item.question.question}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.question.options.map((option, optionIndex) => {
                      const isSelected = item.selectedAnswer === optionIndex;
                      const isCorrect = item.question!.correctAnswer === optionIndex;
                      
                      let optionClass = 'p-2 rounded border text-sm ';
                      if (isSelected && isCorrect) {
                        optionClass += 'bg-green-50 border-green-200 text-green-800';
                      } else if (isSelected && !isCorrect) {
                        optionClass += 'bg-red-50 border-red-200 text-red-800';
                      } else if (isCorrect) {
                        optionClass += 'bg-green-50 border-green-200 text-green-800';
                      } else {
                        optionClass += 'bg-gray-50 border-gray-200 text-gray-600';
                      }
                      
                      return (
                        <div key={optionIndex} className={optionClass}>
                          <div className="flex items-center">
                            {isSelected && (
                              <div className={`w-2 h-2 rounded-full mr-2 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            )}
                            {!isSelected && isCorrect && (
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            )}
                            <span>{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {!item.isCorrect && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Correct answer:</strong> {item.question.options[item.question.correctAnswer]}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Link
          to={`/quiz/${result.topic.toLowerCase()}`}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Retake Quiz
        </Link>
        
        <Link
          to="/practice"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          Try Another Topic
        </Link>
        
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          <Home className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Results;