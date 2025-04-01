import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const CertificateVerification = await ethers.getContractFactory("CertificateVerification");
  const certificateVerification = await CertificateVerification.deploy();
  await certificateVerification.waitForDeployment();
  console.log("CertificateVerification deployed to:", await certificateVerification.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 