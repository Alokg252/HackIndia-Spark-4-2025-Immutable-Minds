import React, { useState } from 'react';
import { generateTestCertificate } from '../utils/testUtils';
import Certificate from './Certificate';

const TestCertificate: React.FC = () => {
  const [certificate, setCertificate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateCertificate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newCertificate = await generateTestCertificate();
      console.log('Generated certificate:', newCertificate); // Debug log
      setCertificate(newCertificate);
    } catch (err) {
      console.error('Certificate generation error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Failed to generate test certificate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Test Certificate Generator</h2>
        
        <button
          onClick={handleGenerateCertificate}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? 'Generating...' : 'Generate Test Certificate'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {certificate && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Generated Certificate</h3>
            <div className="border rounded-lg p-4">
              <Certificate
                studentName={certificate.studentName}
                courseName={certificate.courseName}
                completionDate={certificate.completionDate}
                certificateId={certificate.id}
                instructorName={certificate.instructorName}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCertificate; 