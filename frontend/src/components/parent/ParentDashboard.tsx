import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStudentProgress, mockQuizResults, mockUsers } from '../../data/mockData';
import { User, BookOpen, TrendingUp, Clock, Target, Trophy, Calendar } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Get child's data
  const child = mockUsers.find(u => u.id === user?.childId);
  const childProgress = mockStudentProgress.find(p => p.studentId === user?.childId);
  const childResults = mockQuizResults.filter(r => r.studentId === user?.childId);

  if (!child || !childProgress) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Child data not found. Please contact support.</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const recentResults = childResults
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    .slice(-7); // Last 7 results

  const progressData = {
    labels: recentResults.map(r => new Date(r.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Quiz Scores',
        data: recentResults.map(r => (r.score / r.totalQuestions) * 10),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const topicPerformanceData = {
    labels: Object.keys(childProgress.topics),
    datasets: [
      {
        label: 'Average Score',
        data: Object.values(childProgress.topics).map(topic => topic.averageScore),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  const getScoreColor = (score: number) => {
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
        <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="text-gray-600 mt-1">Track {child.name}'s learning progress and achievements</p>
      </div>

      {/* Child Info Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {child.avatar ? (
              <img
                src={child.avatar}
                alt={child.name}
                className="h-16 w-16 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            <div className="ml-4">
              <h2 className="text-2xl font-bold">{child.name}</h2>
              <p className="text-blue-100">{child.email}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{childProgress.overallProgress}%</div>
            <p className="text-blue-100">Overall Progress</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Quizzes Completed</dt>
                  <dd className="text-2xl font-bold text-gray-900">{childProgress.totalQuizzesCompleted}</dd>
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
                  <dd className="text-2xl font-bold text-gray-900">{childProgress.averageScore.toFixed(1)}/10</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Topics Studied</dt>
                  <dd className="text-2xl font-bold text-gray-900">{Object.keys(childProgress.topics).length}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Overall Progress</dt>
                  <dd className="text-2xl font-bold text-gray-900">{childProgress.overallProgress}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Progress Over Time */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Progress Over Time</h3>
            <p className="mt-1 text-sm text-gray-500">Quiz scores trend</p>
          </div>
          <div className="p-6">
            <div style={{ height: '300px' }}>
              {recentResults.length > 0 ? (
                <Line data={progressData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No quiz data available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Topic Performance */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Performance by Topic</h3>
            <p className="mt-1 text-sm text-gray-500">Average scores across subjects</p>
          </div>
          <div className="p-6">
            <div style={{ height: '300px' }}>
              <Bar data={topicPerformanceData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Topic Progress */}
      <div className="bg-white shadow rounded-lg border border-gray-200 mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Detailed Topic Progress</h3>
          <p className="mt-1 text-sm text-gray-500">Breakdown of {child.name}'s performance in each subject</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {Object.entries(childProgress.topics).map(([topic, data]) => (
              <div key={topic}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{topic}</h4>
                  <span className="text-sm text-gray-500">
                    {data.completed}/{data.totalQuizzes} quizzes completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${getProgressColor((data.completed / data.totalQuizzes) * 100)}`}
                    style={{ width: `${(data.completed / data.totalQuizzes) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      Average Score: <span className="font-medium">{data.averageScore.toFixed(1)}/10</span>
                    </span>
                    <span className="text-gray-600">
                      Progress: <span className="font-medium">{Math.round((data.completed / data.totalQuizzes) * 100)}%</span>
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Last: {new Date(data.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Quiz Results */}
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Quiz Results</h3>
          <p className="mt-1 text-sm text-gray-500">Latest quiz performance</p>
        </div>
        <div className="p-6">
          {childResults.length > 0 ? (
            <div className="space-y-4">
              {childResults
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 5)
                .map((result) => {
                  const percentage = Math.round((result.score / result.totalQuestions) * 100);
                  const timeMinutes = Math.floor(result.timeSpent / 60);
                  const timeSeconds = result.timeSpent % 60;
                  
                  return (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{result.topic}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(result.completedAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {timeMinutes}m {timeSeconds}s
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score)}`}>
                            {result.score}/{result.totalQuestions} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">{child.name} hasn't taken any quizzes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;