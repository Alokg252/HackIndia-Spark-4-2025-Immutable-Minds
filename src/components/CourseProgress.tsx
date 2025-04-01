import React, { useState, useEffect } from 'react';
import CertificateService from '../services/CertificateService';
import Certificate from './Certificate';

interface CourseProgressProps {
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  instructorName: string;
  progress: number;
  onProgressUpdate: (progress: number) => void;
}

const CourseProgress: React.FC<CourseProgressProps> = ({
  courseId,
  courseName,
  studentId,
  studentName,
  instructorName,
  progress,
  onProgressUpdate,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);

  useEffect(() => {
    const checkCompletion = async () => {
      if (progress >= 100) {
        try {
          const certificateService = CertificateService.getInstance();
          const existingCertificates = await certificateService.getStudentCertificates(studentId);
          const courseCertificate = existingCertificates.find(cert => cert.courseId === courseId);

          if (!courseCertificate) {
            const newCertificate = await certificateService.generateCertificate({
              studentName,
              courseName,
              completionDate: new Date().toISOString(),
              instructorName,
              studentId,
              courseId,
            });
            setCertificate(newCertificate);
            setShowCertificate(true);
          }
        } catch (error) {
          console.error('Error generating certificate:', error);
        }
      }
    };

    checkCompletion();
  }, [progress, courseId, studentId, studentName, courseName, instructorName]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progress: {progress}%</span>
        <span>{progress >= 100 ? 'Completed!' : 'In Progress'}</span>
      </div>

      {showCertificate && certificate && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Congratulations! You've completed the course!</h3>
          <Certificate
            studentName={certificate.studentName}
            courseName={certificate.courseName}
            completionDate={certificate.completionDate}
            instructorName={certificate.instructorName}
            certificateHash={certificate.certificateHash}
          />
        </div>
      )}
    </div>
  );
};

export default CourseProgress; 