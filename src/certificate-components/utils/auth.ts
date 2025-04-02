import { keccak256, toUtf8Bytes } from "ethers";

export const generateHash = (data: any): string => {
  const stringData = JSON.stringify(data);
  return keccak256(toUtf8Bytes(stringData));
};