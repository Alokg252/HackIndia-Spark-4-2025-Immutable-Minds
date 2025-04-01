import CertificateService from '../services/CertificateService';

export const generateTestCertificate = async () => {
  const certificateService = CertificateService.getInstance();
  
  const testData = {
    studentName: "John Doe",
    courseName: "Web Development Fundamentals",
    completionDate: new Date().toISOString(),
    instructorName: "Jane Smith",
    studentId: "test-student-123",
    courseId: "test-course-456"
  };

  try {
    const certificate = await certificateService.generateCertificate(testData);
    console.log('Test certificate generated:', certificate);
    return certificate;
  } catch (error) {
    console.error('Error generating test certificate:', error);
    throw error;
  }
}; 