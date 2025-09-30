import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStudentProgress, mockQuizResults, mockUsers } from '../../data/mockData';
import { Users, BookOpen, TrendingUp, Award, Clock, Target } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  // Get students in the teacher's class
  const classStudents = mockUsers.filter(u => u.role === 'student' && u.classId === user?.classId);
  const studentIds = classStudents.map(s => s.id);
  
  // Get progress and results for students
  const classProgress = mockStudentProgress.filter(p => studentIds.includes(p.studentId));
  const classResults = mockQuizResults.filter(r => studentIds.includes(r.studentId));

  // Calculate class statistics
  const totalQuizzes = classResults.length;
  const averageScore = classResults.length > 0 
    ? classResults.reduce((sum, result) => sum + result.score, 0) / classResults.length 
    : 0;
  const classAverage = Math.round(averageScore * 10) / 10;

  // Topic performance data
  const topicPerformance = classResults.reduce((acc, result) => {
    if (!acc[result.topic]) {
      acc[result.topic] = { totalScore: 0, count: 0 };
    }
    acc[result.topic].totalScore += result.score;
    acc[result.topic].count += 1;
    return acc;
  }, {} as Record<string, { totalScore: number; count: number }>);

  const topicAverages = Object.entries(topicPerformance).map(([topic, data]) => ({
    topic,
    average: Math.round((data.totalScore / data.count) * 10) / 10
  }));

  // Chart data
  const topicBarData = {
    labels: topicAverages.map(t => t.topic),
    datasets: [
      {
        label: 'Average Score',
        data: topicAverages.map(t => t.average),
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

  const performanceDistributionData = {
    labels: ['Excellent (80-100%)', 'Good (60-79%)', 'Needs Improvement (<60%)'],
    datasets: [
      {
        data: [
          classResults.filter(r => (r.score / r.totalQuestions) * 100 >= 80).length,
          classResults.filter(r => {
            const percentage = (r.score / r.totalQuestions) * 100;
            return percentage >= 60 && percentage < 80;
          }).length,
          classResults.filter(r => (r.score / r.totalQuestions) * 100 < 60).length,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's how your class is performing.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                  <dd className="text-2xl font-bold text-gray-900">{classStudents.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Quizzes</dt>
                  <dd className="text-2xl font-bold text-gray-900">{totalQuizzes}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Class Average</dt>
                  <dd className="text-2xl font-bold text-gray-900">{classAverage}/10</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Students</dt>
                  <dd className="text-2xl font-bold text-gray-900">{classProgress.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Topic Performance Chart */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Topic Performance</h3>
            <p className="mt-1 text-sm text-gray-500">Average scores by subject</p>
          </div>
          <div className="p-6">
            <div style={{ height: '300px' }}>
              <Bar data={topicBarData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Performance Distribution</h3>
            <p className="mt-1 text-sm text-gray-500">How students are performing overall</p>
          </div>
          <div className="p-6">
            <div style={{ height: '300px' }}>
              <Doughnut data={performanceDistributionData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Student Performance Table */}
      <div className="bg-white shadow rounded-lg border border-gray-200 mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Individual Student Performance</h3>
          <p className="mt-1 text-sm text-gray-500">Detailed breakdown of each student's progress</p>
        </div>
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quizzes Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overall Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classStudents.map((student) => {
                  const progress = classProgress.find(p => p.studentId === student.id);
                  const studentResults = classResults.filter(r => r.studentId === student.id);
                  const lastActivity = studentResults.length > 0 
                    ? new Date(Math.max(...studentResults.map(r => new Date(r.completedAt).getTime())))
                    : null;
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {student.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={student.avatar}
                              alt={student.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {progress?.totalQuizzesCompleted || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {progress?.averageScore?.toFixed(1) || '0.0'}/10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${progress?.overallProgress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{progress?.overallProgress || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lastActivity ? (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {lastActivity.toLocaleDateString()}
                          </div>
                        ) : (
                          'No activity'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Quiz Activity</h3>
          <p className="mt-1 text-sm text-gray-500">Latest quiz submissions from your students</p>
        </div>
        <div className="p-6">
          {classResults.length > 0 ? (
            <div className="space-y-4">
              {classResults
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 5)
                .map((result) => {
                  const student = classStudents.find(s => s.id === result.studentId);
                  const percentage = Math.round((result.score / result.totalQuestions) * 100);
                  
                  const getScoreColor = (percentage: number) => {
                    if (percentage >= 80) return 'text-green-600 bg-green-100';
                    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
                    return 'text-red-600 bg-red-100';
                  };
                  
                  return (
                    <div key={result.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        {student?.avatar ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={student.avatar}
                            alt={student.name}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{student?.name}</p>
                          <p className="text-sm text-gray-500">{result.topic}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(percentage)}`}>
                          {result.score}/{result.totalQuestions} ({percentage}%)
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(result.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No quiz activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;