const ExploreSection = () => {
  const subjects = [
    'Psychology & Mental Health',
    'Healthcare & Medicine',
    'IT & Computer Science',
    'Copywriting/Marketing',
    'Business/Management'
  ];

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-8 py-24">
        {/* Explore Top Subjects */}
        <div className="mb-24">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-[48px] leading-tight font-bold mb-2">
                Explore<br />
                top <span className="text-[#FF4D4D]">subjects</span>
              </h2>
              <p className="text-gray-600 max-w-md">
                Whether tackling trauma, mastering mindfulness or gearing up for a career as a psychologist, our expert-led courses and credentials will help you achieve career success and satisfaction.
              </p>
            </div>
            <div className="bg-yellow-400 px-4 py-2 rounded-full">
              <span className="text-sm font-medium">Our subjects</span>
            </div>
          </div>

          {/* Subject Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {subjects.map((subject, index) => (
              <button
                key={index}
                className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-gray-300 transition-colors"
              >
                {subject}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button className="bg-[#FF4D4D] text-white px-8 py-3 rounded-lg font-medium">
              Explore courses
            </button>
            <button className="text-gray-700 flex items-center gap-2 font-medium">
              View all subjects
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Upgrade Skills Banner */}
        <div className="bg-yellow-400 rounded-3xl p-12 flex justify-between items-center">
          <div className="max-w-xl">
            <h2 className="text-[40px] leading-tight font-bold mb-4">
              Upgrade your <span className="text-white">skills</span><br />
              with <span className="text-white">FREE</span> online courses
            </h2>
            <p className="text-gray-700 mb-8">
              Ready to gain in-demand skills to kickstart your career? The Learnify Click Start programme offers 29 FREE online courses to help you get your first experience in your chosen profession
            </p>
            <button className="bg-black text-white px-8 py-3 rounded-lg font-medium">
              Start now
            </button>
          </div>
          <div className="relative">
            <div className="absolute -top-16 -right-8">
              <svg width="300" height="200" viewBox="0 0 300 200">
                <g transform="translate(100, 0)">
                  <rect width="80" height="80" fill="#6B46C1" rx="8"/>
                  <rect width="80" height="80" x="40" y="40" fill="#FF4D4D" rx="8"/>
                  <path d="M0 40 L40 40 L40 80" stroke="white" strokeWidth="4" fill="none"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreSection; 