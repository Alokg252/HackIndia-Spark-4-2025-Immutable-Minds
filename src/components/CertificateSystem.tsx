import { useState } from 'react';
import { blockchainService } from '../services/blockchain';

const CertificateSystem = () => {
  const [formData, setFormData] = useState({
    recipientName: '',
    courseName: '',
    issueDate: new Date().toISOString().split('T')[0],
    issuerName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const hash = await blockchainService.issueCertificate(
        formData.recipientName,
        formData.courseName,
        formData.issuerName
      );
      setSuccess(true);
      console.log('Certificate issued with hash:', hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating certificate');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-gray-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        <div>
          <label htmlFor="recipientName" className="block text-sm font-medium">
            Recipient Name
          </label>
          <input
            type="text"
            id="recipientName"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md bg-[#2c2d32] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="courseName" className="block text-sm font-medium">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md bg-[#2c2d32] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium">
            Issue Date
          </label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md bg-[#2c2d32] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="issuerName" className="block text-sm font-medium">
            Issuer Name
          </label>
          <input
            type="text"
            id="issuerName"
            name="issuerName"
            value={formData.issuerName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md bg-[#2c2d32] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-900 bg-opacity-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-200">Error</h3>
                <div className="mt-2 text-sm text-red-300">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-md bg-green-900 bg-opacity-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-200">Success!</h3>
                <div className="mt-2 text-sm text-green-300">
                  Certificate has been generated and stored on the blockchain.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading 
                ? 'bg-purple-700 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
            }`}
          >
            {loading ? 'Generating...' : 'Generate Certificate'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateSystem; 