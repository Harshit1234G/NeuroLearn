import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStudentProgress, mockQuizResults } from '../../data/mockData';
import { BookOpen, Trophy, Clock, TrendingUp, Play, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Get student progress data
  const studentProgress = mockStudentProgress.find(p => p.studentId === user?.id);
  const recentResults = mockQuizResults.filter(r => r.studentId === user?.id).slice(-3);

  if (!studentProgress) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Start your learning journey by taking your first quiz.</p>
        </div>
      </div>
    );
  }

  const getGradeColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Ready to continue your learning journey?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overall Progress</dt>
                  <dd className="text-2xl font-bold text-gray-900">{studentProgress.overallProgress}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Quizzes Completed</dt>
                  <dd className="text-2xl font-bold text-gray-900">{studentProgress.totalQuizzesCompleted}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                  <dd className="text-2xl font-bold text-gray-900">{studentProgress.averageScore.toFixed(1)}/10</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Topics Studied</dt>
                  <dd className="text-2xl font-bold text-gray-900">{Object.keys(studentProgress.topics).length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Topic Progress */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Topic Progress</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {Object.entries(studentProgress.topics).map(([topic, data]) => (
                <div key={topic}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{topic}</h4>
                    <span className="text-sm text-gray-500">
                      {data.completed}/{data.totalQuizzes} quizzes
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor((data.completed / data.totalQuizzes) * 100)}`}
                      style={{ width: `${(data.completed / data.totalQuizzes) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Avg Score: {data.averageScore.toFixed(1)}/10
                    </span>
                    <span className="text-xs text-gray-500">
                      Last: {new Date(data.lastActivity).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Quiz Results</h3>
          </div>
          <div className="p-6">
            {recentResults.length > 0 ? (
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{result.topic}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(result.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(result.score)}`}>
                          {result.score}/{result.totalQuestions}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.floor(result.timeSpent / 60)}min {result.timeSpent % 60}s
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No quiz results yet. Start practicing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready for your next challenge?</h3>
              <p className="text-blue-100">Choose a topic and start practicing to improve your scores!</p>
            </div>
            <Link
              to="/practice"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Practice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;