import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import CertificateSystem from './components/CertificateSystem';
import Sidebar from './components/Sidebar';
import CourseList from './components/CourseList';
import ExploreSection from './components/ExploreSection';
import Footer from './components/Footer';
import Subjects from './components/Subjects';
import Degrees from './components/Degrees';
import Enterprise from './components/Enterprise';
import Web3Auth from './components/Web3Auth';
import Profile from './components/Profile';
import MyCourses from './components/MyCourses';
import Certificates from './components/Certificates';
import Dashboard from './components/Dashboard';
import { initializeDatabase } from './services/initDatabase';
import CoursesPage from './components/CoursesPage';
import CertificateValidation from './pages/CertificateValidation';
import TestCertificate from './components/TestCertificate';
import CertifyPro from './certificate-components/certifyPro';

interface Course {
  id: number;
  title: string;
  category: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  resources: {
    videos: number;
    articles: number;
    downloads: number;
  };
  sections: Array<{
    title: string;
    lessons: Array<{
      id: number;
      title: string;
      duration: string;
      preview: boolean;
    }>;
  }>;
  backgroundColor: string;
}

const App = () => {
  const [showCourseList, setShowCourseList] = useState(true);
  const [showCertificateSystem, setShowCertificateSystem] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const initialized = await initializeDatabase();
      setDbInitialized(initialized);
    };
    init();
  }, []);

  const FooterWrapper = () => {
    const location = useLocation();
    const noFooterRoutes = ['/dashboard'];
    
    if (noFooterRoutes.includes(location.pathname)) {
      return null;
    }
    
    return <Footer />;
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('profile-menu');
      const button = document.getElementById('profile-button');
      if (menu && button && !menu.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBackClick = () => {
    setShowCourseList(true);
  };

  const handleLessonClick = (lessonId: number) => {
    setCurrentLesson(lessonId);
  };

  const handleConnect = (address: string) => {
    setIsAuthenticated(true);
    setUserAddress(address);
  };

  const handleDisconnect = () => {
    setIsAuthenticated(false);
    setUserAddress('');
    setShowProfileMenu(false);
  };

  const ProfileMenu = () => {
    const navigate = useNavigate();

    return (
      <div className="relative">
        <button
          id="profile-button"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 border border-gray-200 hover:border-gray-300 transition-all"
        >
          <div className="w-8 h-8 bg-[#FF4D4D] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{userAddress.slice(2, 4).toUpperCase()}</span>
          </div>
          <span className="text-sm font-medium">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`transform transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {showProfileMenu && (
          <div
            id="profile-menu"
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-3 border border-gray-100 transform opacity-0 scale-95 animate-fadeIn"
            style={{
              animation: 'fadeIn 0.2s ease-out forwards',
            }}
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="text-sm font-medium">Wallet Connected</div>
              <div className="text-sm text-gray-600">{userAddress}</div>
            </div>
            
            <div className="py-2">
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowProfileMenu(false)}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10L10 3L17 10L17 17H13V12H7V17H3V10Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Dashboard
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowProfileMenu(false)}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="none">
                  <path d="M10 12C12.2091 12 14 10.2091 14 8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M16 17C16 14.2386 13.3137 12 10 12C6.68629 12 4 14.2386 4 17" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                My Profile
              </Link>
              
              <Link
                to="/my-courses"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowProfileMenu(false)}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4L17 8L10 12L3 8L10 4Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M17 8V12L10 16L3 12V8" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                My Courses
              </Link>
              
              <Link
                to="/certificates"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowProfileMenu(false)}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="none">
                  <path d="M15 7V15H5V7M15 7L10 4L5 7M15 7L10 10L5 7" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Certificates
              </Link>

              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowProfileMenu(false)}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="none">
                  <path d="M8 5L8 4C8 3.44772 8.44772 3 9 3H11C11.5523 3 12 3.44772 12 4V5M8 5H12M8 5H4M12 5H16M4 5V16C4 16.5523 4.44772 17 5 17H15C15.5523 17 16 16.5523 16 16V5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 9H12" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 13H12" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Settings
              </Link>
            </div>

            <div className="border-t border-gray-100">
              <button
                onClick={() => {
                  handleDisconnect();
                  setShowProfileMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="none">
                  <path d="M13 10L18 10M18 10L16 8M18 10L16 12" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M18 6V4C18 3.44772 17.5523 3 17 3H3C2.44772 3 2 3.44772 2 4V16C2 16.5523 2.44772 17 3 17H17C17.5523 17 18 16.5523 18 16V14" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const HomePage = () => {
    const navigate = useNavigate();

    const handleFindCourse = () => {
      // Scroll to course list section
      document.querySelector('.course-list')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleViewBlog = () => {
      // Navigate to blog page
      navigate('/blog');
    };

    return (
      <>
        {/* Hero Section */}
        <section className="px-8 pt-16 pb-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex justify-between items-start mb-20">
              <div className="max-w-2xl">
                <h1 className="text-[64px] leading-[1.1] font-bold mb-4 tracking-[-0.02em]">
                  Find the right <span className="text-[#FF4D4D]">course</span><br />
                  for you
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  See your personalised recommendations<br />
                  based on your interests and goals
                </p>
                <div className="flex items-center gap-8">
                  <button 
                    onClick={handleFindCourse}
                    className="bg-[#FF4D4D] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#ff3333] transition-colors"
                  >
                    Find course
                  </button>
                  <button 
                    onClick={handleViewBlog}
                    className="text-gray-700 flex items-center gap-2 hover:text-black transition-colors"
                  >
                    View our blog
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-4">Certified teachers only</div>
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                    <img src="/teacher1.jpg" alt="Teacher" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                    <img src="/teacher2.jpg" alt="Teacher" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                    <img src="/teacher3.jpg" alt="Teacher" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                    <img src="/teacher4.jpg" alt="Teacher" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center font-medium">
                    135+
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex gap-6">
              <div className="w-[280px] bg-white rounded-[24px] p-6 border border-gray-100">
                <span className="inline-block px-4 py-1.5 bg-purple-100 text-sm font-medium rounded-full">
                  Education
                </span>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-1">subjects</div>
                  <div className="text-[40px] font-bold leading-none">+40</div>
                </div>
              </div>

              <div className="w-[280px] bg-[#F3F0FF] rounded-[24px] p-6">
                <span className="inline-block px-4 py-1.5 bg-yellow-400 text-sm font-medium rounded-full">
                  Online
                </span>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-1">courses</div>
                  <div className="text-[40px] font-bold leading-none">+120</div>
                </div>
              </div>

              <div className="w-[280px] bg-[#FFF9E6] rounded-[24px] p-6">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <span className="text-yellow-400">★★★★★</span>
                  <span>5.0</span>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-1">learner reviews</div>
                  <div className="text-[40px] font-bold leading-none">+180k</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="course-list">
          <CourseList />
        </div>
        <ExploreSection />
      </>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="py-4 px-8">
          <div className="max-w-[1400px] mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-[#FF4D4D]">Learn</span>ify
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-12">
              <div className="flex items-center gap-1">
                <Link to="/subjects" className="text-gray-700 hover:text-black transition-colors">Subjects</Link>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex items-center gap-1">
                <Link to="/courses" className="text-gray-700 hover:text-black transition-colors">Courses</Link>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <Link to="/degrees" className="text-gray-700 hover:text-black transition-colors">Degrees</Link>
              <Link to="/enterprise" className="text-gray-700 hover:text-black transition-colors">For business</Link>
              <Link to="/certificate" className="text-gray-700 hover:text-black transition-colors">Certificate</Link>
            </div>

            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <Web3Auth onConnect={handleConnect} onDisconnect={handleDisconnect} />
              ) : (
                <ProfileMenu />
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/degrees" element={<Degrees />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/dashboard" element={<Dashboard userAddress={null} />} />
          <Route path="/profile" element={<Profile userAddress={userAddress} />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/certificate" element={<CertifyPro />} />
          <Route path="/settings" element={<div className="p-8"><h1>Settings Page</h1></div>} />
          <Route path="/blog" element={<div className="p-8"><h1>Blog Page</h1></div>} />
          <Route path="/validate-certificate/:certificateId" element={<CertificateValidation />} />
          <Route path="/test-certificate" element={<TestCertificate />} />
        </Routes>

        <FooterWrapper />
      </div>
    </Router>
  );
};

export default App;
