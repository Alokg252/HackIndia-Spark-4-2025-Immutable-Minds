import { v4 as uuidv4 } from 'uuid';
import DatabaseService from './DatabaseService';
import { ethers } from 'ethers';

interface CertificateData {
  id: string;
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  studentId: string;
  courseId: string;
  certificateHash: string;
}

class CertificateService {
  private static instance: CertificateService;
  private db: DatabaseService;

  private constructor() {
    this.db = DatabaseService.getInstance();
  }

  public static getInstance(): CertificateService {
    if (!CertificateService.instance) {
      CertificateService.instance = new CertificateService();
    }
    return CertificateService.instance;
  }

  async generateCertificate(data: Omit<CertificateData, 'id' | 'certificateHash'>): Promise<CertificateData> {
    const certificateId = uuidv4();
    
    // Generate a unique hash for the certificate
    const hashData = `${data.studentName}-${data.courseName}-${data.completionDate}-${data.instructorName}-${data.studentId}-${data.courseId}`;
    const certificateHash = ethers.keccak256(ethers.toUtf8Bytes(hashData));
    
    const certificate: CertificateData = {
      ...data,
      id: certificateId,
      certificateHash,
    };

    await this.db.execute('INSERT', 'certificates', certificate);
    return certificate;
  }

  async validateCertificate(certificateHash: string): Promise<CertificateData | null> {
    const certificates = await this.db.query('certificates', { certificateHash });
    return certificates[0] || null;
  }

  async getStudentCertificates(studentId: string): Promise<CertificateData[]> {
    return await this.db.query('certificates', { studentId });
  }

  async getCourseCertificates(courseId: string): Promise<CertificateData[]> {
    return await this.db.query('certificates', { courseId });
  }
}

export default CertificateService; 