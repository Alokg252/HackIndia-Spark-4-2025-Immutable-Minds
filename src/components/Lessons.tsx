import React from 'react';

interface Lesson {
  id: number;
  title: string;
  instructor: string;
  time: string;
  status: 'upcoming' | 'completed' | 'in-progress';
}

const Lessons: React.FC = () => {
  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'Introduction to Blockchain',
      instructor: 'Dr. Smith',
      time: '2:00 PM',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Smart Contract Development',
      instructor: 'Prof. Johnson',
      time: '3:30 PM',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Web3 Integration',
      instructor: 'Ms. Davis',
      time: '5:00 PM',
      status: 'upcoming'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Lessons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
            <p className="text-gray-600 mb-2">Instructor: {lesson.instructor}</p>
            <p className="text-gray-600 mb-4">Next class: Today, {lesson.time}</p>
            <div className="flex items-center justify-between">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Join Class
              </button>
              <span className={`px-3 py-1 rounded-full text-sm ${
                lesson.status === 'upcoming' 
                  ? 'bg-blue-100 text-blue-800'
                  : lesson.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons; 