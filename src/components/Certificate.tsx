import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  certificateHash?: string;
}

const Certificate: React.FC<CertificateProps> = ({ 
  studentName, 
  courseName, 
  completionDate,
  instructorName,
  certificateHash 
}) => {
  return (
    <div className="bg-white p-8 rounded-lg border-8 border-double border-gray-200">
      <div className="text-center">
        <h1 className="text-4xl font-serif mb-8">Certificate of Completion</h1>
        
        <p className="text-xl mb-6">This is to certify that</p>
        
        <p className="text-3xl font-bold mb-6 text-[#FF4D4D]">{studentName}</p>
        
        <p className="text-xl mb-6">has successfully completed the course</p>
        
        <p className="text-3xl font-bold mb-8">{courseName}</p>
        
        <div className="flex justify-between items-center mt-16">
          <div className="text-center">
            <div className="w-48 border-t-2 border-gray-400 pt-2">
              <p className="text-sm text-gray-600">Date of Completion</p>
              <p className="font-medium">{new Date(completionDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="text-center">
            <img src="/signature.png" alt="Signature" className="h-12 mb-2" />
            <div className="w-48 border-t-2 border-gray-400 pt-2">
              <p className="text-sm text-gray-600">Course Instructor</p>
              <p className="font-medium">{instructorName}</p>
            </div>
          </div>
        </div>

        {certificateHash && (
          <div className="mt-8 flex flex-col items-center">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <QRCodeSVG
                value={`${window.location.origin}/validate-certificate/${certificateHash}`}
                size={150}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">Scan to verify</p>
            <p className="text-xs text-gray-400 mt-1">ID: {certificateHash.slice(0, 8)}...</p>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Certificate ID: {certificateHash ? certificateHash.slice(0, 8) + '...' : Date.now().toString(36).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate; 