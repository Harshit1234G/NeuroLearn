import React, { useState } from 'react';
import { mockTopics } from '../../data/mockData';
import { BookOpen, Clock, Target, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Practice: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const navigate = useNavigate();

  const startQuiz = (topicName: string) => {
    navigate(`/quiz/${topicName.toLowerCase()}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '●';
      case 'medium': return '●●';
      case 'hard': return '●●●';
      default: return '●';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Practice Mode</h1>
        <p className="text-gray-600 mt-1">Choose a topic to start practicing with 10 multiple choice questions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockTopics.length}</p>
              <p className="text-gray-600 text-sm">Available Topics</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">10</p>
              <p className="text-gray-600 text-sm">Questions per Quiz</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">~7</p>
              <p className="text-gray-600 text-sm">Minutes Average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Selection */}
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Select a Topic</h3>
          <p className="mt-1 text-sm text-gray-500">Click on a topic to view details and start practicing</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTopics.map((topic) => (
              <div
                key={topic.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTopic === topic.name 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTopic(selectedTopic === topic.name ? null : topic.name)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: topic.color }}
                      ></div>
                      <h4 className="text-lg font-semibold text-gray-900">{topic.name}</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-gray-500">
                        <Target className="h-4 w-4 mr-1" />
                        {topic.questionsCount} questions
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(topic.difficulty)}`}>
                        {getDifficultyIcon(topic.difficulty)} {topic.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedTopic === topic.name && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p className="mb-1">• 10 multiple choice questions</p>
                        <p className="mb-1">• 4 options per question</p>
                        <p>• Instant feedback and detailed results</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startQuiz(topic.name);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold mr-3 mt-0.5">1</div>
            <div>
              <h4 className="font-medium">Choose Topic</h4>
              <p>Select a topic that interests you or that you want to improve on</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold mr-3 mt-0.5">2</div>
            <div>
              <h4 className="font-medium">Take Quiz</h4>
              <p>Answer 10 multiple choice questions at your own pace</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold mr-3 mt-0.5">3</div>
            <div>
              <h4 className="font-medium">View Results</h4>
              <p>Get instant feedback and track your progress over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;