import { ethers } from 'ethers';
import { Web3ReactHooks } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

export interface WalletBalance {
  eth: string;
  usd: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
}

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

class WalletService {
  private static instance: WalletService;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  public async isConnected(): Promise<boolean> {
    try {
      if (!this.provider || !this.signer) {
        return false;
      }
      const address = await this.signer.getAddress();
      return !!address;
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  }

  public async connect(connector: InjectedConnector) {
    try {
      await connector.activate();
      if (!window.ethereum) {
        throw new Error('No Ethereum provider found');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      this.provider = provider;
      this.signer = await provider.getSigner();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  public async disconnect() {
    try {
      if (this.provider) {
        await this.provider.send('wallet_requestPermissions', [{ eth_accounts: {} }]);
      }
      this.provider = null;
      this.signer = null;
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  }

  public async getBalance(): Promise<WalletBalance> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const address = await this.signer.getAddress();
      const balance = await this.provider!.getBalance(address);
      const ethBalance = ethers.formatEther(balance);

      // Get ETH price in USD (you'll need to implement this)
      const ethPrice = await this.getEthPrice();
      const usdBalance = parseFloat(ethBalance) * ethPrice;

      return {
        eth: ethBalance,
        usd: usdBalance,
      };
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  public async sendTransaction(to: string, amount: string): Promise<Transaction> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      const receipt = await tx.wait();
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      // Get transaction details
      const txResponse = await this.provider!.getTransaction(tx.hash);
      if (!txResponse) {
        throw new Error('Transaction not found');
      }

      return {
        hash: receipt.hash,
        from: receipt.from,
        to: receipt.to || '',
        value: ethers.formatEther(txResponse.value),
        timestamp: Math.floor(Date.now() / 1000), // Current timestamp as fallback
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  private async getEthPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      return data.ethereum.usd;
    } catch (error) {
      console.error('Error getting ETH price:', error);
      throw error;
    }
  }
}

export default WalletService; 