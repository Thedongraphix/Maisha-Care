export const TemporaryAccess =  [
    {
      "type": "constructor",
      "inputs": [
        { "name": "_roleManager", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "accessExpiry",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "approveAccess",
      "inputs": [
        { "name": "_doctor", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "builderAccess",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "denyAccess",
      "inputs": [
        { "name": "_doctor", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "grantBuilderAccess",
      "inputs": [
        { "name": "_builder", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "grantResearchAccess",
      "inputs": [
        { "name": "_researcher", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "hasAccess",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" },
        { "name": "_doctor", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "hasBuilderAccess",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" },
        { "name": "_builder", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "hasResearchAccess",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" },
        { "name": "_researcher", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "pendingAccessRequests",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "requestAccess",
      "inputs": [
        { "name": "_patient", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "researchAccess",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "revokeAccess",
      "inputs": [
        { "name": "_doctor", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "roleManager",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract RoleManager"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "AccessApproved",
      "inputs": [
        {
          "name": "patient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "doctor",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "expiryTime",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AccessDenied",
      "inputs": [
        {
          "name": "patient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "doctor",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AccessRequested",
      "inputs": [
        {
          "name": "doctor",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "patient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AccessRevoked",
      "inputs": [
        {
          "name": "patient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "doctor",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BuilderAccessGranted",
      "inputs": [
        {
          "name": "patient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "builder",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ResearchAccessGranted",
      "inputs": [
        {
          "name": "patient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "researcher",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    { "type": "error", "name": "AccessNotGranted", "inputs": [] },
    { "type": "error", "name": "InvalidAddress", "inputs": [] },
    { "type": "error", "name": "NoPendingRequest", "inputs": [] },
    { "type": "error", "name": "NotAuthorized", "inputs": [] }
  ]