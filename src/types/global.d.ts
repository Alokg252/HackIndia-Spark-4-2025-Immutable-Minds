import { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
        };
    }
}

declare module '*.json' {
    const value: any;
    export default value;
}

interface ContractTransaction extends ethers.ContractTransaction {
    wait(): Promise<ethers.ContractReceipt>;
}

export interface CertificateContract extends ethers.Contract {
    issueCertificate(
        recipientName: string,
        courseName: string,
        issuerName: string
    ): Promise<ContractTransaction>;
    verifyCertificate(certificateHash: string): Promise<boolean>;
    getCertificate(certificateHash: string): Promise<{
        recipientName: string;
        courseName: string;
        issueDate: bigint;
        issuerName: string;
        isValid: boolean;
    }>;
}

export {}; 