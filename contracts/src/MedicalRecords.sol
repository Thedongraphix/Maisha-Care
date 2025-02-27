// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {BaseMedicalData} from "./BaseContracts/BaseMedicalData.sol";

/// @title MedicalRecords
/// @notice Manages medical records for patients
/// @dev Inherits from BaseMedicalData
contract MedicalRecords is BaseMedicalData {
    // Custom errors
    error RecordNotFound();

    // Struct to store medical record data
    struct MedicalRecord {
        string dataHash;
        uint256 lastUpdated;
    }

    // Mapping to store medical records for each patient
    mapping(address => MedicalRecord[]) private patientRecords;

    // Events
    event RecordAdded(address indexed patient, uint256 timestamp);
    event RecordAccessed(
        address indexed accessor,
        address indexed patient,
        uint256 timestamp
    );

    /// @notice Contract constructor
    /// @param _roleManager Address of the RoleManager contract
    /// @param _updateApproval Address of the UpdateApproval contract
    /// @param _temporaryAccess Address of the TemporaryAccess contract
    constructor(
        address _roleManager,
        address _updateApproval,
        address _temporaryAccess
    ) BaseMedicalData(_roleManager, _updateApproval, _temporaryAccess) {}

    /// @notice Initiate an update for a patient's record
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new data
    /// @return updateId Unique identifier for the update request
    function initiateUpdate(
        address _patient,
        string memory _dataHash
    ) public override returns (bytes32) {
        if (
            !roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender) &&
            !roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender)
        ) {
            revert NotAuthorized();
        }
        if (
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender) &&
            !temporaryAccess.hasAccess(_patient, msg.sender)
        ) {
            revert NoTemporaryAccess();
        }
        if (
            roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender) &&
            msg.sender != _patient
        ) {
            revert NotAuthorized();
        }

        return super.initiateUpdate(_patient, _dataHash);
    }

    /// @notice Internal function to update medical record data
    /// @param _patient Address of the patient
    /// @param _dataHash New data hash
    /// @dev This function is required to satisfy the BaseMedicalData contract
    function _updateDataInternal(
        address _patient,
        string memory _dataHash
    ) internal override {
        // This function is not used directly, but we implement it to satisfy the contract structure
        // The actual record addition is done in the addMedicalRecord function
    }

    /// @notice Add a new medical record for a patient
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new data
    /// @dev This function is called after the update is approved
    function addMedicalRecord(
        address _patient,
        string memory _dataHash
    ) external onlyOwner {
        MedicalRecord memory newRecord = MedicalRecord({
            dataHash: _dataHash,
            lastUpdated: block.timestamp
        });

        patientRecords[_patient].push(newRecord);
        emit RecordAdded(_patient, block.timestamp);
    }

    /// @notice Get medical records for a patient (patient access)
    /// @param _patient Address of the patient
    /// @return string[] Array of data hashes
    /// @return uint256[] Array of update timestamps
    function getRecordsPatient(
        address _patient
    ) public returns (string[] memory, uint256[] memory) {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender))
            revert NotAuthorized();
        if (msg.sender != _patient) revert NotAuthorized();
        emit RecordAccessed(msg.sender, _patient, block.timestamp);
        return _getRecords(_patient);
    }

    /// @notice Get medical records for a patient (doctor access)
    /// @param _patient Address of the patient
    /// @return string[] Array of data hashes
    /// @return uint256[] Array of update timestamps
    function getRecordsDoctor(
        address _patient
    ) public returns (string[] memory, uint256[] memory) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NoTemporaryAccess();
        emit RecordAccessed(msg.sender, _patient, block.timestamp);
        return _getRecords(_patient);
    }

    /// @notice Internal function to get medical records
    /// @param _patient Address of the patient
    /// @return string[] Array of data hashes
    /// @return uint256[] Array of update timestamps
    function _getRecords(
        address _patient
    ) private view returns (string[] memory, uint256[] memory) {
        MedicalRecord[] storage records = patientRecords[_patient];

        if (records.length == 0) revert RecordNotFound();

        string[] memory dataHashes = new string[](records.length);
        uint256[] memory timestamps = new uint256[](records.length);

        for (uint256 i = 0; i < records.length; i++) {
            dataHashes[i] = records[i].dataHash;
            timestamps[i] = records[i].lastUpdated;
        }

        return (dataHashes, timestamps);
    }

    /// @notice Get anonymized medical records for a patient (researcher access)
    /// @param _patient Address of the patient
    /// @return uint256[] Array of update timestamps
    function getAnonymizedRecords(
        address _patient
    ) public returns (uint256[] memory) {
        if (!roleManager.hasRole(roleManager.RESEARCHER_ROLE(), msg.sender))
            revert NotAuthorized();
        emit RecordAccessed(msg.sender, _patient, block.timestamp);
        return _getAnonymizedRecords(_patient);
    }

    /// @notice Get anonymized medical records for a patient (builder access)
    /// @param _patient Address of the patient
    /// @return uint256[] Array of update timestamps
    function getBuilderRecords(
        address _patient
    ) public returns (uint256[] memory) {
        if (!roleManager.hasRole(roleManager.BUILDER_ROLE(), msg.sender))
            revert NotAuthorized();
        emit RecordAccessed(msg.sender, _patient, block.timestamp);
        return _getAnonymizedRecords(_patient);
    }

    /// @notice Internal function to get anonymized medical records
    /// @param _patient Address of the patient
    /// @return uint256[] Array of update timestamps
    function _getAnonymizedRecords(
        address _patient
    ) private view returns (uint256[] memory) {
        MedicalRecord[] storage records = patientRecords[_patient];

        if (records.length == 0) revert RecordNotFound();

        uint256[] memory timestamps = new uint256[](records.length);

        for (uint256 i = 0; i < records.length; i++) {
            timestamps[i] = records[i].lastUpdated;
        }

        return timestamps;
    }
}
