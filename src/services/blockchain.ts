import { ethers } from 'ethers';
import type { CertificateContract } from '../types/global';
import CertificateVerification from '../contracts/CertificateVerification.json';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Deployed contract address
const CONTRACT_ABI = CertificateVerification.abi;

export class BlockchainService {
    private provider: ethers.BrowserProvider | null = null;
    private contract: CertificateContract | null = null;

    async initialize() {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }

        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            this.provider
        ) as CertificateContract;
    }

    async connectWallet() {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            await this.initialize();
            return true;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            return false;
        }
    }

    async issueCertificate(
        recipientName: string,
        courseName: string,
        issuerName: string
    ): Promise<string> {
        try {
            if (!this.provider || !this.contract) {
                throw new Error('Blockchain service not initialized');
            }

            const signer = await this.provider.getSigner();
            const contractWithSigner = this.contract.connect(signer) as CertificateContract;
            
            const tx = await contractWithSigner.issueCertificate(
                recipientName,
                courseName,
                issuerName
            );
            
            const receipt = await tx.wait();
            return receipt?.hash || '';
        } catch (error) {
            console.error('Error issuing certificate:', error);
            throw error;
        }
    }

    async verifyCertificate(certificateHash: string): Promise<boolean> {
        try {
            if (!this.contract) {
                throw new Error('Blockchain service not initialized');
            }
            const isValid = await this.contract.verifyCertificate(certificateHash);
            return isValid;
        } catch (error) {
            console.error('Error verifying certificate:', error);
            throw error;
        }
    }

    async getCertificateDetails(certificateHash: string) {
        try {
            if (!this.contract) {
                throw new Error('Blockchain service not initialized');
            }
            const details = await this.contract.getCertificate(certificateHash);
            return {
                recipientName: details.recipientName,
                courseName: details.courseName,
                issueDate: new Date(Number(details.issueDate) * 1000),
                issuerName: details.issuerName,
                isValid: details.isValid
            };
        } catch (error) {
            console.error('Error getting certificate details:', error);
            throw error;
        }
    }
}

export const blockchainService = new BlockchainService(); 