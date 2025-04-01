import { ethers } from "hardhat";

async function main() {
  console.log("Deploying CoursePayment contract...");

  const CoursePayment = await ethers.getContractFactory("CoursePayment");
  const coursePayment = await CoursePayment.deploy();

  await coursePayment.waitForDeployment();

  const address = await coursePayment.getAddress();
  console.log("CoursePayment deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 