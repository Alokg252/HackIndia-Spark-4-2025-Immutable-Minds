const Subjects = () => {
  const subjects = [
    {
      title: 'Psychology & Mental Health',
      description: 'Explore the human mind and behavior with expert-led courses.',
      count: '42 courses'
    },
    {
      title: 'Healthcare & Medicine',
      description: 'Learn about healthcare practices and medical advancements.',
      count: '38 courses'
    },
    {
      title: 'IT & Computer Science',
      description: 'Master programming, data science, and digital technologies.',
      count: '56 courses'
    },
    {
      title: 'Business & Management',
      description: 'Develop leadership skills and business acumen.',
      count: '45 courses'
    },
    {
      title: 'Design & Creative',
      description: 'Unleash your creativity with practical design courses.',
      count: '34 courses'
    }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-[64px] leading-tight font-bold mb-4">
              Explore our<br />
              <span className="text-[#FF4D4D]">subjects</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-xl">
              Choose from over 40 subjects and start learning today with our expert-led courses.
            </p>
          </div>
          <div className="bg-yellow-400 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">All subjects</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-3">{subject.title}</h3>
              <p className="text-gray-600 mb-4">{subject.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{subject.count}</span>
                <button className="text-[#FF4D4D] font-medium flex items-center gap-2">
                  View courses
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subjects; 