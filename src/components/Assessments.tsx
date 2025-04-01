import React, { useState } from 'react';

interface Assessment {
  id: number;
  title: string;
  subject: string;
  duration: string;
  totalQuestions: number;
  dueDate: string;
  status: 'upcoming' | 'completed' | 'in-progress';
  score?: number;
}

const Assessments: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'in-progress'>('all');

  const assessments: Assessment[] = [
    {
      id: 1,
      title: 'Blockchain Fundamentals Quiz',
      subject: 'Blockchain',
      duration: '30 minutes',
      totalQuestions: 20,
      dueDate: '2024-03-20',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Smart Contract Development Test',
      subject: 'Development',
      duration: '45 minutes',
      totalQuestions: 15,
      dueDate: '2024-03-22',
      status: 'completed',
      score: 85
    },
    {
      id: 3,
      title: 'Web3 Integration Assessment',
      subject: 'Web3',
      duration: '60 minutes',
      totalQuestions: 25,
      dueDate: '2024-03-25',
      status: 'in-progress'
    }
  ];

  const filteredAssessments = filter === 'all'
    ? assessments
    : assessments.filter(a => a.status === filter);

  const getStatusColor = (status: Assessment['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Assessments</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Assessments</option>
          <option value="upcoming">Upcoming</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <div key={assessment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{assessment.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(assessment.status)}`}>
                {assessment.status.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-gray-600">Subject: {assessment.subject}</p>
              <p className="text-gray-600">Duration: {assessment.duration}</p>
              <p className="text-gray-600">Questions: {assessment.totalQuestions}</p>
              <p className="text-gray-600">
                Due: {new Date(assessment.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {assessment.score !== undefined && (
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Score</span>
                  <span className="text-lg font-semibold text-green-600">{assessment.score}%</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${assessment.score}%` }}
                  />
                </div>
              </div>
            )}

            {assessment.status === 'upcoming' && (
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Assessment
              </button>
            )}

            {assessment.status === 'in-progress' && (
              <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                Continue Assessment
              </button>
            )}

            {assessment.status === 'completed' && (
              <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                View Results
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No assessments found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default Assessments; 