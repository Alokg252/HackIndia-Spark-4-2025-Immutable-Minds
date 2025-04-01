import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CertificateService from '../services/CertificateService';
import Certificate from '../components/Certificate';
import { BrowserProvider, Contract, zeroPadValue } from 'ethers';
import CertificateVerification from '../contracts/CertificateVerification.json';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

const CertificateValidation: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [certificate, setCertificate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateCertificate = async () => {
      if (!certificateId) {
        setError('Invalid certificate ID');
        setIsLoading(false);
        return;
      }

      // Check if this is a sample certificate
      if (certificateId === '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef') {
        setCertificate({
          studentName: 'Sample Student',
          courseName: 'Introduction to Web Development',
          completionDate: new Date().toISOString(),
          instructorName: 'Dr. Sarah Chen',
          certificateHash: certificateId
        });
        setIsLoading(false);
        return;
      }

      if (!window.ethereum) {
        setError('Please install MetaMask or another Web3 wallet to verify certificates');
        setIsLoading(false);
        return;
      }

      try {
        // Connect to the blockchain
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(
          process.env.REACT_APP_CERTIFICATE_CONTRACT_ADDRESS || '',
          CertificateVerification.abi,
          provider
        );

        // Convert certificateId to bytes32
        const certificateHash = zeroPadValue(certificateId, 32);

        // Verify certificate on the blockchain
        const [recipientName, courseName, issueDate, issuerName, isValid] = await contract.verifyCertificate(certificateHash);

        if (isValid) {
          setCertificate({
            studentName: recipientName,
            courseName: courseName,
            completionDate: new Date(Number(issueDate) * 1000).toISOString(),
            instructorName: issuerName,
            certificateHash: certificateId
          });
        } else {
          setError('Certificate is not valid or has been revoked');
        }
      } catch (err) {
        console.error('Certificate validation error:', err);
        setError('Error validating certificate. Please check the certificate ID and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateCertificate();
  }, [certificateId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Validating certificate...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Certificate not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Certificate Validation</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Certificate Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Student Name:</p>
              <p className="font-semibold">{certificate.studentName}</p>
            </div>
            <div>
              <p className="text-gray-600">Course Name:</p>
              <p className="font-semibold">{certificate.courseName}</p>
            </div>
            <div>
              <p className="text-gray-600">Completion Date:</p>
              <p className="font-semibold">{new Date(certificate.completionDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Instructor:</p>
              <p className="font-semibold">{certificate.instructorName}</p>
            </div>
            <div>
              <p className="text-gray-600">Certificate ID:</p>
              <p className="font-semibold">{certificate.certificateHash}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-bold">Valid Certificate</p>
            <p>This certificate has been verified and is authentic.</p>
          </div>
        </div>

        <Certificate
          studentName={certificate.studentName}
          courseName={certificate.courseName}
          completionDate={certificate.completionDate}
          instructorName={certificate.instructorName}
          certificateHash={certificate.certificateHash}
        />
      </div>
    </div>
  );
};

export default CertificateValidation; 