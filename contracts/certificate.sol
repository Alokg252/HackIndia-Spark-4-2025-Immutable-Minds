// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateValidator {
    bytes32[] public certificateHashes;
    mapping(bytes32 => bool) public isCertificateAdded;

    event CertificateAdded(bytes32 hash);
    event CertificateAlreadyExists(bytes32 hash);

    function addCertificate(bytes32 hash) public returns (bool success, string memory message) {
        if (isCertificateAdded[hash]) {
            emit CertificateAlreadyExists(hash);
            return (false, "Certificate already exists");
        }
        isCertificateAdded[hash] = true;
        certificateHashes.push(hash);
        emit CertificateAdded(hash);
        return (true, "Certificate added successfully");
    }

    function isValidCertificate(bytes32 hash) public view returns (bool) {
        return isCertificateAdded[hash];
    }

    function totalCertificates() public view returns (uint256) {
        return certificateHashes.length;
    }
}
