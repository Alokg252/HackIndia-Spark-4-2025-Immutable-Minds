import React, { useState } from 'react';
import Certificate from './Certificate';
import { blockchainService } from '../services/blockchain';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  certificateHash?: string;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ 
  isOpen, 
  onClose, 
  studentName, 
  courseName, 
  completionDate,
  instructorName,
  certificateHash 
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationError(null);
    try {
      // Check if this is a sample certificate
      if (certificateHash === '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef') {
        setIsVerified(true);
        setIsVerifying(false);
        return;
      }

      // Initialize blockchain service
      await blockchainService.initialize();
      
      // Verify the certificate
      const isValid = await blockchainService.verifyCertificate(certificateHash || '');
      setIsVerified(isValid);
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = () => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 800;

    // Draw certificate background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 8;
    ctx.setLineDash([20, 10]);
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Add text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 150);

    ctx.font = '24px sans-serif';
    ctx.fillText('This is to certify that', canvas.width / 2, 250);

    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#FF4D4D';
    ctx.fillText(studentName, canvas.width / 2, 350);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('has successfully completed the course', canvas.width / 2, 450);

    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(courseName, canvas.width / 2, 550);

    // Add completion date
    ctx.font = '20px sans-serif';
    ctx.fillText(`Completed on: ${new Date(completionDate).toLocaleDateString()}`, canvas.width / 2, 650);

    // Convert canvas to image and download
    const link = document.createElement('a');
    link.download = `certificate-${courseName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Certificate</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <Certificate
          studentName={studentName}
          courseName={courseName}
          completionDate={completionDate}
          instructorName={instructorName}
          certificateHash={certificateHash || undefined}
        />

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="bg-[#FF4D4D] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#ff3333] transition-colors disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify Certificate'}
          </button>
        </div>

        {verificationError && (
          <div className="mt-4 text-red-600">
            {verificationError}
          </div>
        )}

        {isVerified && certificateHash && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Certificate Verification QR Code</h3>
              <p className="text-sm text-gray-600 mb-4">Scan this QR code to verify the certificate</p>
              <div className="inline-block p-2 bg-white rounded-lg shadow-sm">
                <QRCodeSVG
                  value={`${window.location.origin}/validate-certificate/${certificateHash}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Certificate ID: {certificateHash.slice(0, 8)}...</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-4">
            {isVerified && (
              <>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-[#FF4D4D] text-white rounded-lg font-medium hover:bg-[#ff3333] transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Certificate
                </button>
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/validate-certificate/${certificateHash}`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'My Course Certificate',
                        text: `I've completed the course "${courseName}"! View my certificate:`,
                        url: shareUrl
                      }).catch(console.error);
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      navigator.clipboard.writeText(shareUrl);
                      alert('Certificate link copied to clipboard!');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Certificate
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal; 