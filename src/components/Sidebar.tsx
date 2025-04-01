import { useState } from 'react';

interface SidebarProps {
  onBackClick: () => void;
  onLessonClick: (lessonId: number) => void;
}

const Sidebar = ({ onBackClick, onLessonClick }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      title: 'Course Introduction',
      lessons: [
        { id: 1, title: 'Introduction', duration: '5:20' },
        { id: 2, title: 'Setting Up Environment', duration: '10:15' },
        { id: 3, title: 'Basic Concepts', duration: '15:30' }
      ]
    },
    {
      title: 'Smart Contracts',
      lessons: [
        { id: 4, title: 'What are Smart Contracts', duration: '12:30' },
        { id: 5, title: 'Writing Your First Contract', duration: '20:45' },
        { id: 6, title: 'Testing Smart Contracts', duration: '18:20' }
      ]
    }
  ];

  const handleGetHelp = () => {
    window.open('https://discord.gg/blockchain-course', '_blank');
  };

  const handleFeedback = () => {
    window.open('https://forms.gle/feedback', '_blank');
  };

  return (
    <div className="w-64 bg-[#25262b] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onBackClick}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <span className="mr-2">←</span>
          Back to Courses
        </button>
      </div>

      {/* Course Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => (
          <div key={index} className="border-b border-gray-700">
            <button
              className={`w-full p-4 text-left hover:bg-gray-700 ${
                activeSection === index ? 'bg-gray-700' : ''
              }`}
              onClick={() => setActiveSection(index)}
            >
              <h3 className="font-medium">{section.title}</h3>
            </button>
            {activeSection === index && (
              <div className="bg-[#2c2d32]">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className="w-full p-4 text-left text-sm text-gray-400 hover:bg-gray-700 hover:text-white flex items-center justify-between"
                    onClick={() => onLessonClick(lesson.id)}
                  >
                    <span>{lesson.title}</span>
                    <span>{lesson.duration}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleGetHelp}
          className="w-full mb-2 py-2 px-4 bg-gray-700 rounded hover:bg-gray-600 text-sm"
        >
          Get Help
        </button>
        <button
          onClick={handleFeedback}
          className="w-full py-2 px-4 bg-gray-700 rounded hover:bg-gray-600 text-sm"
        >
          Leave Feedback
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 