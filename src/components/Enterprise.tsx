const Enterprise = () => {
  const features = [
    {
      title: 'Custom Learning Paths',
      description: 'Create tailored learning experiences for your teams with customizable course paths.'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Track progress and measure impact with detailed learning analytics and reports.'
    },
    {
      title: 'Dedicated Support',
      description: '24/7 priority support and dedicated customer success manager for your organization.'
    },
    {
      title: 'Integration Options',
      description: 'Seamlessly integrate with your existing LMS and HR systems.'
    }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-[64px] leading-tight font-bold mb-4">
              Learnify for<br />
              <span className="text-[#FF4D4D]">Enterprise</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-xl mb-8">
              Empower your workforce with world-class training and development solutions.
            </p>
            <button className="bg-[#FF4D4D] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#FF3333] transition-colors">
              Contact sales
            </button>
          </div>
          <div className="bg-yellow-400 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">Enterprise solutions</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-black text-white rounded-3xl p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your organization?</h2>
            <p className="text-gray-400 mb-8">
              Join thousands of leading companies using Learnify Enterprise to build in-demand career skills.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#FF4D4D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF3333] transition-colors">
                Schedule a demo
              </button>
              <button className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors">
                View pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enterprise; 