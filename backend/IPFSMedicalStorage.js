import { PinataSDK } from 'pinata-web3';

class IPFSMedicalStorage {
  constructor(pinataJwt, pinataGateway) {
    this.pinata = new PinataSDK({
      pinataJwt: pinataJwt,
      pinataGateway: pinataGateway
    });
  }

  async storeEncryptedData(patientId, dataType, encryptedDataPackage) {
    try {
      const result = await this.pinata.upload.json({
        patientId,
        dataType,
        ...encryptedDataPackage
      });
      
      return {
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp
      };
    } catch (error) {
      console.error('Error storing encrypted data:', error);
      throw error;
    }
  }

  async retrieveEncryptedData(ipfsHash) {
    try {
      const content = await this.pinata.gateways.get(ipfsHash);
      return content.data;
    } catch (error) {
      console.error('Error retrieving encrypted data:', error);
      return null;
    }
  }
}

export default IPFSMedicalStorage;