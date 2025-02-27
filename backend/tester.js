import crypto from 'crypto';

// Step 2: Define the data structure
const sampleData = {
  patientId: "12345",
  name: "John Doe",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  medicalHistory: [
    {
      condition: "Hypertension",
      diagnosedDate: "2020-03-15"
    }
  ],
  currentMedications: [
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily"
    }
  ],
  lastCheckup: "2023-05-01"
};

console.log("Original Data:", sampleData);

// Step 3: Generate Asymmetric Key Pair (Simulating Crypto Wallet Keys)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

console.log("Generated Asymmetric Key Pair:",{publicKey, privateKey});

// Step 4: Generate Symmetric Key and Encrypt Data
function encryptData(data, symmetricKey) {
  const iv = crypto.randomBytes(12); // 96-bit nonce for AES-GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', symmetricKey, iv);

  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    iv: iv,
    encryptedData: Buffer.from(encrypted, 'hex'),
    authTag: authTag
  };
}

const symmetricKey = crypto.randomBytes(32); // 256-bit key
console.log("Generated Symmetric Key:", symmetricKey.toString('hex'));

const encryptedResult = encryptData(sampleData, symmetricKey);

console.log("Encrypted Data with Symmetric Key:", {
  iv: encryptedResult.iv.toString('hex'),
  encryptedData: encryptedResult.encryptedData.toString('hex'),
  authTag: encryptedResult.authTag.toString('hex')
});

// Step 5: Encrypt Symmetric Key with Public Key
const encryptedSymmetricKey = crypto.publicEncrypt(
  publicKey,
  symmetricKey
);

console.log("Encrypted Symmetric Key with Public Key:", encryptedSymmetricKey.toString('hex'));

// Step 6: Sign Encrypted Data with Private Key
const signer = crypto.createSign('sha256');
signer.update(encryptedResult.encryptedData);
signer.end();

const signature = signer.sign(privateKey);

console.log("Digital Signature of Encrypted Data:", signature.toString('hex'));

// Step 7: Store Encrypted Data and Keys
const storedData = {
  encryptedData: encryptedResult.encryptedData,
  iv: encryptedResult.iv,
  authTag: encryptedResult.authTag,
  encryptedSymmetricKey: encryptedSymmetricKey,
  signature: signature
};

console.log("Stored Data Structure:", {
  encryptedData: storedData.encryptedData.toString('hex'),
  iv: storedData.iv.toString('hex'),
  authTag: storedData.authTag.toString('hex'),
  encryptedSymmetricKey: storedData.encryptedSymmetricKey.toString('hex'),
  signature: storedData.signature.toString('hex')
});

// Step 8: Decryption and Verification Process
function decryptData(storedData, privateKey, publicKey) {
  // Decrypt symmetric key
  const decryptedSymmetricKey = crypto.privateDecrypt(
    privateKey,
    storedData.encryptedSymmetricKey
  );

  console.log("Decrypted Symmetric Key:", decryptedSymmetricKey.toString('hex'));

  // Verify signature
  const verifier = crypto.createVerify('sha256');
  verifier.update(storedData.encryptedData);
  verifier.end();

  const isVerified = verifier.verify(publicKey, storedData.signature);

  console.log("Signature Verification Result:", isVerified);

  if (!isVerified) {
    throw new Error('Signature verification failed');
  }

  // Decrypt data
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    decryptedSymmetricKey,
    storedData.iv
  );
  decipher.setAuthTag(storedData.authTag);

  let decrypted = decipher.update(storedData.encryptedData, null, 'utf8');
  decrypted += decipher.final('utf8');

  const decryptedData = JSON.parse(decrypted);

  return decryptedData;
}

try {
  const decryptedData = decryptData(storedData, privateKey, publicKey);

  console.log("Decrypted Data:", decryptedData);
  console.log("Decrypted data matches original:", JSON.stringify(decryptedData) === JSON.stringify(sampleData));
} catch (error) {
  console.error("Decryption or Verification Failed:", error.message);
}

// Step 9: Demonstrate Tampering Detection
function tamperWithData(storedData) {
  const tamperedData = { ...storedData };
  // Tamper with the encrypted data
  const tamperedEncryptedData = Buffer.from('00' + tamperedData.encryptedData.toString('hex').slice(2), 'hex');
  tamperedData.encryptedData = tamperedEncryptedData;
  return tamperedData;
}

const tamperedStoredData = tamperWithData(storedData);

try {
  decryptData(tamperedStoredData, privateKey, publicKey);
} catch (error) {
  console.error("Tampered Data Detection:", error.message);
}
