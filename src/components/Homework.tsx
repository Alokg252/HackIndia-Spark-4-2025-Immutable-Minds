import React, { useState } from 'react';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
}

const Homework: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  const assignments: Assignment[] = [
    {
      id: 1,
      title: 'Blockchain Fundamentals Assignment',
      subject: 'Blockchain',
      dueDate: '2024-03-20',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Smart Contract Implementation',
      subject: 'Development',
      dueDate: '2024-03-22',
      status: 'submitted'
    },
    {
      id: 3,
      title: 'Web3 Integration Project',
      subject: 'Web3',
      dueDate: '2024-03-25',
      status: 'graded',
      grade: 'A'
    }
  ];

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === filter);

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Homework</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Assignments</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="graded">Graded</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
                <p className="text-gray-600 mb-2">Subject: {assignment.subject}</p>
                <p className="text-gray-600">
                  Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(assignment.status)}`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
                {assignment.grade && (
                  <span className="mt-2 text-lg font-semibold text-green-600">
                    Grade: {assignment.grade}
                  </span>
                )}
              </div>
            </div>
            
            {assignment.status === 'pending' && (
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Submit Assignment
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No assignments found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default Homework; 