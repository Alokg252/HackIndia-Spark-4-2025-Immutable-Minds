const Degrees = () => {
  const degrees = [
    {
      title: 'Bachelor of Computer Science',
      university: 'Tech University',
      duration: '4 years',
      price: '$15,000/year',
      description: 'Comprehensive program covering programming, algorithms, and software development.'
    },
    {
      title: 'Master of Business Administration',
      university: 'Business School',
      duration: '2 years',
      price: '$20,000/year',
      description: 'Advanced business education focusing on leadership and management skills.'
    },
    {
      title: 'Master of Data Science',
      university: 'Tech Institute',
      duration: '2 years',
      price: '$18,000/year',
      description: 'Advanced program in data analysis, machine learning, and statistical methods.'
    }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-[64px] leading-tight font-bold mb-4">
              Online<br />
              <span className="text-[#FF4D4D]">degrees</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-xl">
              Earn your degree from world-class universities with flexible online learning.
            </p>
          </div>
          <div className="bg-yellow-400 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">All degrees</span>
          </div>
        </div>

        <div className="space-y-6">
          {degrees.map((degree, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{degree.title}</h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <span>{degree.university}</span>
                    <span>•</span>
                    <span>{degree.duration}</span>
                    <span>•</span>
                    <span>{degree.price}</span>
                  </div>
                  <p className="text-gray-600 max-w-2xl">{degree.description}</p>
                </div>
                <button className="bg-[#FF4D4D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF3333] transition-colors">
                  Learn more
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Degrees; 