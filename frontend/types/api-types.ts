export type TransactionsType = {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
  value: string;
};

export type ConversionRateType = {
  rate: number;
}

export type BalanceData = {
  balanceInUSDC: number;
  balanceInKES: string;
  rate: number;
}

// Define context type
export type BalanceContextType = {
  isLoading: boolean;
  data: BalanceData;
  error: any; // Change to appropriate error type
}

export type BalanceApiResponseType = {
  data: {
    token: string;
    message: string;
    arbitrumWallet: string;
    celoWallet: string;
    phoneNumber: string;
  };
  status: number;
  statusText: string;
  headers: {
    "cache-control": string;
    "content-length": string;
    "content-type": string;
  };
  config: {
    transitional: {
      silentJSONParsing: boolean;
      forcedJSONParsing: boolean;
      clarifyTimeoutError: boolean;
    };
    adapter: string[];
    transformRequest: Array<null>;
    transformResponse: Array<null>;
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
    env: Record<string, unknown>;
    headers: {
      Accept: string;
      "Content-Type": string;
    };
    baseURL: string;
    method: string;
    url: string;
    data: string;
  };
  request: Record<string, unknown>;
};

export type Transaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export type LoginResponseData = {
  token: string;
  message: string;
  arbitrumWallet: string;
  phoneNumber: string;
}

export type LoginResponse = {
  data: {
    token: string;
    message: string;
    arbitrumWallet: string;
    phoneNumber: string;
  };
  status: number;
  statusText: string;
  headers: {
    "cache-control": string;
    "content-length": string;
    "content-type": string;
  };
  config: {
    transitional: {
      silentJSONParsing: boolean;
      forcedJSONParsing: boolean;
      clarifyTimeoutError: boolean;
    };
    adapter: string[];
    transformRequest: (null)[];
    transformResponse: (null)[];
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
    env: Record<string, unknown>;
    headers: {
      Accept: string;
      "Content-Type": string;
    };
    baseURL: string;
    method: string;
    url: string;
    data: string;
  };
  request: Record<string, unknown>;
};

export type PatientType = {
  id: string;               // Unique identifier for the patient
  firstName: string;        // Patient's first name
  lastName: string;         // Patient's last name
  dateOfBirth: Date;        // Patient's date of birth
  gender: 'Male' | 'Female' | 'Other';  // Gender of the patient
  contactNumber: string;    // Patient's contact number
  email?: string;           // Optional email of the patient
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    contactNumber: string;
  };
  medicalHistory?: string[]; // Optional medical history of the patient
}

export type MedicalRecordType = {
  patientId: string;         // ID of the patient
  visitDate: Date;           // Date of the medical visit
  diagnosis: string;         // Doctor's diagnosis
  treatment: string;         // Treatment plan or medication prescribed
  doctor: {
    name: string;
    specialty: string;
  };
  notes?: string;            // Optional additional notes
  followUpDate?: Date;       // Optional follow-up appointment date
  labResults?: {
    testName: string;
    result: string;
    normalRange: string;
  }[];    
}


export type MedicalFormData = {
  currentHealth: {
    vitalSigns: {
      bloodPressureSystolic: string;
      bloodPressureDiastolic: string;
      heartRate: string;
      respiratoryRate: string;
      bodyTemperature: string;
      oxygenSaturation: string;
    };
    bodyMeasurements: {
      height: string;
      weight: string;
    };
    generalHealth: {
      generalAppearance: string;
      levelOfConsciousness: string;
      painScore: string;
    };
    currentSymptoms: {
      primaryComplaint: string;
      durationOfSymptoms: string;
      severityOfSymptoms: string;
    };
    currentMedications: Array<{ name: string; dosage: string; frequency: string }>;
    allergies: Array<{ allergy: string; severity: string }>;
    lifestyleFactors: {
      smokingStatus: string;
      alcoholConsumption: string;
      exerciseHabits: string;
      dietOverview: string;
    };
  };
  medicalHistory: {
    pastMedicalConditions: Array<{
      condition: string;
      yearDiagnosed: string;
      currentStatus: string;
    }>;
    surgicalHistory: Array<{ surgery: string; date: string; complications: string }>;
    familyMedicalHistory: Array<{ condition: string; relationship: string }>;
    immunizationRecords: Array<{ vaccination: string; dateAdministered: string }>;
    majorInjuries: Array<{
      description: string;
      dateOccurred: string;
      treatmentReceived: string;
    }>;
    chronicMedications: Array<{ medication: string; durationOfUse: string }>;
    pastHospitalizations: Array<{ reason: string; dateAndDuration: string }>;
    mentalHealthHistory: {
      diagnosedConditions: string;
      treatmentsReceived: string;
    };
    reproductiveHistory: {
      pregnancies: string;
      childbirthDetails: string;
    };
  };
  treatmentRecords: {
    visitInformation: {
      dateOfVisit: string;
      reasonForVisit: string;
      treatingPhysician: string;
    };
    diagnosis: {
      primaryDiagnosis: string;
      secondaryDiagnoses: string;
      icdCodes: string;
    };
    treatmentPlan: {
      prescribedMedications: Array<{
        medication: string;
        dosage: string;
        instructions: string;
      }>;
      nonPharmacologicalInterventions: string;
    };
    proceduresPerformed: Array<{ name: string; date: string; outcome: string }>;
    laboratoryTests: Array<{ test: string; results: string; dateOfResults: string }>;
    imagingStudies: Array<{ type: string; date: string; resultsSummary: string }>;
    referrals: Array<{ specialist: string; reasonForReferral: string }>;
    followUpInstructions: {
      nextAppointmentDate: string;
      specificInstructions: string;
    };
    progressNotes: string;
  };
};
