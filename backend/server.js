import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import IPFSMedicalStorage from './IPFSMedicalStorage.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize IPFSMedicalStorage
const ipfsMedicalStorage = new IPFSMedicalStorage(
  process.env.JWT,
  process.env.PINATA_GATEWAY
);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

app.post('/api/store-data', async (req, res) => {
  try {
    const { patientId, dataType, encryptedDataPackage } = req.body;

    // Input validation
    if (!patientId || !dataType || !encryptedDataPackage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof patientId !== 'string' || typeof dataType !== 'string' || typeof encryptedDataPackage !== 'object') {
      return res.status(400).json({ error: 'Invalid data types' });
    }

    const result = await ipfsMedicalStorage.storeEncryptedData(patientId, dataType, encryptedDataPackage);

    // Return only the ipfsHash
    res.status(201).json({ ipfsHash: result.ipfsHash });
  } catch (error) {
    console.error('Data storage error:', error);
    if (error.message.includes('Pinata API Error')) {
      return res.status(503).json({ error: 'Storage service unavailable' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/retrieve-data', async (req, res) => {
  try {
    const { ipfsHash } = req.body;

    // Input validation
    if (!ipfsHash) {
      return res.status(400).json({ error: 'IPFS hash is required' });
    }

    if (typeof ipfsHash !== 'string') {
      return res.status(400).json({ error: 'Invalid IPFS hash format' });
    }

    const encryptedDataPackage = await ipfsMedicalStorage.retrieveEncryptedData(ipfsHash);

    if (!encryptedDataPackage) {
      return res.status(404).json({ error: 'Data not found' });
    }

    // Return the retrieved data directly
    res.json(encryptedDataPackage);
  } catch (error) {
    console.error('Data retrieval error:', error);
    if (error.message.includes('Pinata API Error')) {
      return res.status(503).json({ error: 'Retrieval service unavailable' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;