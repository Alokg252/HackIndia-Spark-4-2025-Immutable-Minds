export const abi = [
    {
    "inputs": [
        {
            "internalType": "bytes32",
            "name": "hash",
            "type": "bytes32"
        }
    ],
    "name": "addCertificate",
    "outputs": [
        {
            "internalType": "bool",
            "name": "success",
            "type": "bool"
        },
        {
            "internalType": "string",
            "name": "message",
            "type": "string"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "bytes32",
            "name": "hash",
            "type": "bytes32"
        }
    ],
    "name": "CertificateAdded",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "bytes32",
            "name": "hash",
            "type": "bytes32"
        }
    ],
    "name": "CertificateAlreadyExists",
    "type": "event"
    },
    {
    "inputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "name": "certificateHashes",
    "outputs": [
        {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
        }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [
        {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
        }
    ],
    "name": "isCertificateAdded",
    "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [
        {
            "internalType": "bytes32",
            "name": "hash",
            "type": "bytes32"
        }
    ],
    "name": "isValidCertificate",
    "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "totalCertificates",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
    }
    ];
    