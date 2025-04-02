import { useState } from "react";


import { useForm } from "react-hook-form";
import { Button } from "./ecomponents/ui/button";
import { Input } from "./ecomponents/ui/input";
import { Label } from "./ecomponents/ui/label";
import { generateHash } from "./utils/auth";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { BrowserProvider, Contract } from "ethers";
import {abi} from "./web3func";

const CONTRACT_ADDRESS = "0xfb91441552105bc3E7A79b7664eb426E96c114F6";
const CONTRACT_ABI = abi;


function CertificateForm({ organizationName }) {

  const provider = new BrowserProvider(window.ethereum);
  const [certificate, setCertificate] = useState(null);
  const { register, handleSubmit,formState: { errors, isSubmitting } } = useForm();
  const [walletAddress, setWalletAddress] = useState("");

  //-----------------------------------------------------------------------------------

  const isValidBytes32 = (hash) => /^0x[a-fA-F0-9]{64}$/.test(hash);
  const connectWallet = async () => {
    if (walletAddress) return alert(`Wallet already connected! ${walletAddress}`);
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };
        
  const checkCertificate = async (hash) => {
    if (!isValidBytes32(hash)) return false;
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const result = await contract.isValidCertificate(hash);
      return result;
    } catch (error) {
      console.error("Error checking certificate", error);
      return false;
    }
  };

  const addCertificate = async (hash) => {
    return new Promise(async (resolve, reject) => {
      try {
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const tx = await contract.addCertificate(hash);
        await tx.wait();
        alert("Certificate added successfully");
        resolve("Certificate added successfully");
      } catch (error) {
        alert(error);
        reject(error);
      }
    });
  };

  //-----------------------------------------------------------------------------------

  const onSubmit = async (data) => {
    if(!walletAddress) return alert("Please connect your wallet!");
    const certificateData = {
      ...data,
      organizationName,
      certificateId: Math.random().toString(36).substr(2, 9),
    };

    // generating hash
    var hash = generateHash(certificateData);
    
    // check if hash is not unique
    while ((await checkCertificate(hash))) {
      certificateData.certificateId = Math.random().toString(36).substr(2, 9);
      console.log("chacked "+hash)
      hash = generateHash(certificateData);
    }
    
    // wait for payment
    try{
      await addCertificate(hash);
    }
    catch (error) {
      alert("Error adding certificate " + error);
      return;
    }

    // generate QR code
    const qrCode = await QRCode.toDataURL(hash);

    setCertificate({
      ...certificateData,
      qrCode,
      hash,
    });
  };

  const downloadPDF = async () => {
    if (!certificate) return;

    const element = document.getElementById("certificate");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`certificate-${certificate.certificateId}.pdf`);
  };

  const HtmlToPDF = async (html) => {
    if (!certificate) return;

    const element = document.createElement("div");
    element.innerHTML = html;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`certificate-${certificate.certificateId}.pdf`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      
      {!certificate ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              {...register("recipientName", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="courseName">Course/Achievement Name</Label>
            <Input
              id="courseName"
              {...register("courseName", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="courseDuration">Course Duration</Label>
            <Input
              id="courseDuration"
              {...register("courseDuration", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              id="issueDate"
              type="date"
              defaultValue={new Date().toLocaleDateString()}
              {...register("issueDate", { required: true })}
            />
          </div>
          <Button type="submit" className={isSubmitting ? "bg-gray-500 cursor-not-allowed" : ""}>{isSubmitting ? "Processing..." : "Generate"}</Button>
          <Button className={`${walletAddress ? "bg-green-500 hover:bg-green-600" : ""} ml-2`} onClick={connectWallet}>{walletAddress ? "Connected" : "Connect Wallet"}</Button>

        </form>
      ) : (
        <div className="space-y-6">
          <div
  id="certificate"
  className="relative bg-white p-12 rounded-xl shadow-2xl border-8 border-yellow-400/60 aspect-video"
>
  {/* Decorative Top Border */}
  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-yellow-300"></div>

  <div className="text-center space-y-6">
    {/* Certificate Title */}
    <h1 className="text-5xl font-extrabold text-gray-900 tracking-wide">
      Certificate of Achievement
    </h1>
    
    {/* Certification Statement */}
    <p className="text-xl italic text-gray-700">This is to certify that</p>

    {/* Recipient Name */}
    <p className="text-4xl font-bold text-gray-900 underline decoration-yellow-400">
      {certificate.recipientName}
    </p>

    {/* Course Completion Statement */}
    <p className="text-xl italic text-gray-700">has successfully completed</p>

    {/* Course Name */}
    <p className="text-3xl font-semibold text-gray-800">{certificate.courseName}</p>

    {/* Issuing Organization & Details */}
    <div className="mt-8 text-lg space-y-2 text-gray-700">
      <p>Issued by: <span className="font-medium">{"Learnify"}</span></p>
      <p>Date: <span className="font-medium">{certificate.issueDate}</span></p>
      <p>Duration: <span className="font-medium">{certificate.courseDuration}</span></p>
    </div>
  </div>

  {/* Signature & QR Code Section */}
  <div className="absolute bottom-8 w-full flex justify-between px-12 items-center">
    {/* Signature Placeholder */}
    <div className="text-center">
      <div className="w-40 h-0.5 bg-gray-700 mx-auto mb-2"></div>
      <p className="text-gray-700 text-sm">Authorized Signature</p>
    </div>

    {/* QR Code */}
    <img
      src={certificate.qrCode}
      alt="Certificate QR Code"
      className="w-24 h-24 shadow-lg border mr-3 border-gray-300 rounded-md"
    />
  </div>
  
  {/* Decorative Bottom Border */}
  <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 to-yellow-500"></div>
</div>

          <div className="flex justify-center">
            <Button onClick={downloadPDF}>Download PDF</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateForm;