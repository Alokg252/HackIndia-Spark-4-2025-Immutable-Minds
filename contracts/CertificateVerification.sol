// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerification {
    struct Certificate {
        string recipientName;
        string courseName;
        uint256 issueDate;
        string issuerName;
        bool isValid;
    }

    mapping(bytes32 => Certificate) public certificates;
    address public owner;

    event CertificateIssued(bytes32 indexed certificateHash, string recipientName, string courseName);
    event CertificateRevoked(bytes32 indexed certificateHash);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function issueCertificate(
        string memory _recipientName,
        string memory _courseName,
        string memory _issuerName
    ) public onlyOwner returns (bytes32) {
        bytes32 certificateHash = keccak256(
            abi.encodePacked(
                _recipientName,
                _courseName,
                block.timestamp,
                _issuerName
            )
        );

        certificates[certificateHash] = Certificate({
            recipientName: _recipientName,
            courseName: _courseName,
            issueDate: block.timestamp,
            issuerName: _issuerName,
            isValid: true
        });

        emit CertificateIssued(certificateHash, _recipientName, _courseName);
        return certificateHash;
    }

    function revokeCertificate(bytes32 _certificateHash) public onlyOwner {
        require(certificates[_certificateHash].issueDate != 0, "Certificate does not exist");
        certificates[_certificateHash].isValid = false;
        emit CertificateRevoked(_certificateHash);
    }

    function verifyCertificate(bytes32 _certificateHash) public view returns (bool) {
        Certificate memory cert = certificates[_certificateHash];
        require(cert.issueDate != 0, "Certificate does not exist");
        return cert.isValid;
    }

    function getCertificate(bytes32 _certificateHash) public view returns (
        string memory recipientName,
        string memory courseName,
        uint256 issueDate,
        string memory issuerName,
        bool isValid
    ) {
        Certificate memory cert = certificates[_certificateHash];
        require(cert.issueDate != 0, "Certificate does not exist");
        return (
            cert.recipientName,
            cert.courseName,
            cert.issueDate,
            cert.issuerName,
            cert.isValid
        );
    }
} 