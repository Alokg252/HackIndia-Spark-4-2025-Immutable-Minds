const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-indigo-600">
              LearnChain
            </a>
          </div>
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-indigo-600">Courses</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">Certificates</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">About</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-600">
              Sign In
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 