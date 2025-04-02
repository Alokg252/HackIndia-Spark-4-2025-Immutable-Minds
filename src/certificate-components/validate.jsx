"use client";

import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import {abi} from "./web3func";

const CONTRACT_ADDRESS = "0xfb91441552105bc3E7A79b7664eb426E96c114F6";
const CONTRACT_ABI = abi;

const provider = new BrowserProvider(window.ethereum);

export default function ValidationForm() {
  const [certificateHash, setCertificateHash] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [status, setStatus] = useState("");
  
  useEffect(() => {
    checkTotalCertificates();
  }, []);
  
  const isValidBytes32 = (hash) => /^0x[a-fA-F0-9]{64}$/.test(hash);
  const checkCertificate = async () => {
    if (!isValidBytes32(certificateHash)) return setStatus("Invalid bytes32 format");
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const result = await contract.isValidCertificate(certificateHash);
      setIsValid(result);
      setStatus(result ? "Certificate is valid" : "Certificate is NOT valid");
    } catch (error) {
      setStatus("Error checking certificate");
      console.error(error);
    }
  };
  
  const checkTotalCertificates = async () => {
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const total = await contract.totalCertificates();
      setTotalCertificates(total.toString());
    } catch (error) {
      console.error("Error fetching total certificates", error);
    }
  };
  
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Certificate Validation</h2>
      <input
        type="text"
        placeholder="Enter Certificate Hash"
        value={certificateHash}
        onChange={(e) => setCertificateHash(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex space-x-2">
        <button onClick={checkCertificate} className="px-4 py-2 bg-gray-500 text-white rounded">Check</button>
      </div>
      <p className={isValid ? "text-green-500" : "text-red-500"}>{status}</p>
      <p className="text-sm text-gray-500">Total Certificates: {totalCertificates}</p>
    </div>
  );
}