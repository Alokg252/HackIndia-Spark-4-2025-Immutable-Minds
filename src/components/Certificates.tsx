import React, { useState, useEffect } from 'react';
import CertificateModal from './CertificateModal';
import UserCourseService, { UserCourse } from '../services/UserCourseService';

const Certificates = () => {
  const [certificates, setCertificates] = useState<UserCourse[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<UserCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const userCourseService = UserCourseService.getInstance();
        const userId = localStorage.getItem('walletAddress');
        if (!userId) {
          console.error('No wallet address found');
          return;
        }
        const completedCourses = await userCourseService.getCompletedCourses(userId);
        setCertificates(completedCourses);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleViewCertificate = (certificate: UserCourse) => {
    console.log('Viewing certificate for course:', certificate.title);
    setSelectedCertificate(certificate);
  };

  const handleViewDemoCertificate = () => {
    const demoCertificate: UserCourse = {
      id: 999,
      userId: 'demo',
      courseId: 999,
      title: 'Introduction to Web Development',
      progress: 100,
      completed: true,
      lastAccessed: new Date().toISOString(),
      instructor: 'Dr. Sarah Chen',
      duration: '40h',
      tags: ['HTML', 'CSS', 'JavaScript', 'React'],
      certificateHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    };
    setSelectedCertificate(demoCertificate);
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Certificates</h1>
        {certificates.length > 0 && (
          <button className="text-gray-700 flex items-center gap-2 hover:text-black transition-colors">
            Download All
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3V13M10 13L6 9M10 13L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't completed any courses yet.</p>
          <p className="text-gray-600 mb-8">Complete a course to earn your first certificate!</p>
          <button
            onClick={handleViewDemoCertificate}
            className="bg-[#FF4D4D] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#ff3333] transition-colors"
          >
            View Sample Certificate
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#FF4D4D] rounded-full flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 15L12 3M12 15L8 11M12 15L16 11" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 21H16" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">{cert.title}</h2>
                      <p className="text-sm text-gray-600">Instructor: {cert.instructor}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Completion Date</div>
                      <div className="font-medium">
                        {new Date(cert.lastAccessed).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Course Duration</div>
                      <div className="font-medium">{cert.duration}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {cert.tags?.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between ml-8">
                  <button 
                    onClick={() => handleViewCertificate(cert)}
                    className="bg-[#FF4D4D] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#ff3333] transition-colors"
                  >
                    View Certificate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCertificate && (
        <CertificateModal
          isOpen={true}
          onClose={() => setSelectedCertificate(null)}
          studentName={localStorage.getItem('userName') || 'Student'}
          courseName={selectedCertificate.title}
          completionDate={selectedCertificate.lastAccessed}
          instructorName={selectedCertificate.instructor}
          certificateHash={selectedCertificate.certificateHash}
        />
      )}
    </div>
  );
};

export default Certificates; 