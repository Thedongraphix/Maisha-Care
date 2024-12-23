export const verifyABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    type: "error",
    name: "AccessControlBadConfirmation",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      {
        internalType: "bytes32",
        name: "neededRole",
        type: "bytes32",
      },
    ],
    type: "error",
    name: "AccessControlUnauthorizedAccount",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
        indexed: true,
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
        indexed: true,
      },
    ],
    type: "event",
    name: "AddressUnverified",
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
        indexed: true,
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
        indexed: true,
      },
      {
        internalType: "bytes32",
        name: "uniqueHash",
        type: "bytes32",
        indexed: false,
      },
    ],
    type: "event",
    name: "AddressVerified",
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
        indexed: true,
      },
      {
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
        indexed: true,
      },
      {
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
        indexed: true,
      },
    ],
    type: "event",
    name: "RoleAdminChanged",
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
        indexed: true,
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
        indexed: true,
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
        indexed: true,
      },
    ],
    type: "event",
    name: "RoleGranted",
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
        indexed: true,
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
        indexed: true,
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
        indexed: true,
      },
    ],
    type: "event",
    name: "RoleRevoked",
    anonymous: false,
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "BUILDER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "DOCTOR_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "PATIENT_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "RESEARCHER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [],
    stateMutability: "pure",
    type: "function",
    name: "getBuilderRole",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [],
    stateMutability: "pure",
    type: "function",
    name: "getDoctorRole",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [],
    stateMutability: "pure",
    type: "function",
    name: "getPatientRole",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [],
    stateMutability: "pure",
    type: "function",
    name: "getResearcherRole",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
    name: "getUniqueHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "grantRole",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
    name: "isVerified",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      {
        internalType: "address",
        name: "callerConfirmation",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "renounceRole",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "revokeRole",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "unverifyAddress",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
      {
        internalType: "bytes32",
        name: "uniqueHash",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "verifyAddress",
  },
];
