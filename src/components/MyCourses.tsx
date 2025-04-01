import React, { useState, useEffect } from 'react';
import UserCourseService from '../services/UserCourseService';
import CertificateModal from './CertificateModal';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: number;
  title: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
}

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      console.log('Fetching user courses...');
      setLoading(true);
      setError(null);
      
      try {
        // Get the user's wallet address from localStorage
        const userAddress = localStorage.getItem('walletAddress');
        if (!userAddress) {
          setError('Please connect your wallet to view your courses.');
          setLoading(false);
          return;
        }

        const userCourseService = UserCourseService.getInstance();
        const userCourses = await userCourseService.getUserCourses(userAddress);
        console.log('Fetched courses:', userCourses);
        
        setCourses(userCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewCertificate = (course: Course) => {
    setSelectedCourse(course);
    setShowCertificate(true);
  };

  const handleContinueLearning = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D4D]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#FF4D4D] text-white px-6 py-2 rounded-lg hover:bg-[#ff3333] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Courses Yet</h2>
            <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet.</p>
            <button
              onClick={() => navigate('/courses')}
              className="bg-[#FF4D4D] text-white px-6 py-2 rounded-lg hover:bg-[#ff3333] transition-colors"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">{course.title}</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#FF4D4D] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                {course.progress === 100 ? (
                  <button
                    onClick={() => handleViewCertificate(course)}
                    className="bg-[#FF4D4D] text-white px-4 py-2 rounded-lg hover:bg-[#ff3333] transition-colors"
                  >
                    View Certificate
                  </button>
                ) : (
                  <button
                    onClick={() => handleContinueLearning(course.id)}
                    className="bg-[#FF4D4D] text-white px-4 py-2 rounded-lg hover:bg-[#ff3333] transition-colors"
                  >
                    Continue Learning
                  </button>
                )}
                <div className="text-sm text-gray-600">
                  Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedCourse && (
          <CertificateModal
            isOpen={showCertificate}
            onClose={() => {
              setShowCertificate(false);
              setSelectedCourse(null);
            }}
            studentName={localStorage.getItem('walletAddress') || 'Student'}
            courseName={selectedCourse.title}
            completionDate={selectedCourse.lastAccessed}
            instructorName="Course Instructor"
          />
        )}
      </div>
    </div>
  );
};

export default MyCourses; 