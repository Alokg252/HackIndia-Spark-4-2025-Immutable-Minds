import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

interface Web3AuthProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

const Web3Auth = ({ onConnect, onDisconnect }: Web3AuthProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);

  useEffect(() => {
    const providerOptions = {
      /* Define your provider options here */
    };

    const modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions,
    });

    setWeb3Modal(modal);

    if (modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!web3Modal) return;
      
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      localStorage.setItem('walletAddress', address);
      onConnect(address);

      // Subscribe to accounts change
      instance.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
          onConnect(accounts[0]);
        } else {
          setAccount(null);
          localStorage.removeItem('walletAddress');
          onDisconnect();
        }
      });

      // Subscribe to chainId change
      instance.on("chainChanged", () => {
        window.location.reload();
      });

      // Subscribe to provider disconnection
      instance.on("disconnect", () => {
        disconnectWallet();
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
      setAccount(null);
      localStorage.removeItem('walletAddress');
      onDisconnect();
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-[#FF4D4D] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#ff3333] transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="text-gray-700 font-medium hover:text-black transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default Web3Auth; 