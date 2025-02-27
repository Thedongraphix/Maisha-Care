// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {BaseMedicalData} from "./BaseContracts/BaseMedicalData.sol";

/// @title TreatmentRecords
/// @notice Manages treatment records for patients
/// @dev Inherits from BaseMedicalData
contract TreatmentRecords is BaseMedicalData {
    // State variables
    mapping(address => DataEntry[]) private treatmentRecords;

    constructor(
        address _roleManager,
        address _updateApproval,
        address _temporaryAccess
    ) BaseMedicalData(_roleManager, _updateApproval, _temporaryAccess) {}

    /// @notice Initiate adding a treatment record
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new treatment record
    /// @return updateId Unique identifier for the update request
    function initiateAddRecord(
        address _patient,
        string memory _dataHash
    ) public returns (bytes32) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NoTemporaryAccess();
        return initiateUpdate(_patient, _dataHash);
    }

    /// @notice Internal function to add a treatment record
    /// @param _patient Address of the patient
    /// @param _dataHash New treatment record hash
    function _updateDataInternal(
        address _patient,
        string memory _dataHash
    ) internal override {
        treatmentRecords[_patient].push(DataEntry(_dataHash, block.timestamp));
    }

    /// @notice Get treatment records for a patient (patient access)
    /// @param _patient Address of the patient
    /// @return string[] Array of treatment record hashes
    /// @return uint256[] Array of update timestamps
    function getRecordsPatient(
        address _patient
    ) public view returns (string[] memory, uint256[] memory) {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender))
            revert NotAuthorized();
        if (msg.sender != _patient) revert NotAuthorized();
        return _getRecords(_patient);
    }

    /// @notice Get treatment records for a patient (doctor access)
    /// @param _patient Address of the patient
    /// @return string[] Array of treatment record hashes
    /// @return uint256[] Array of update timestamps
    function getRecordsDoctor(
        address _patient
    ) public view returns (string[] memory, uint256[] memory) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NoTemporaryAccess();
        return _getRecords(_patient);
    }

    /// @notice Internal function to get treatment records
    /// @param _patient Address of the patient
    /// @return string[] Array of treatment record hashes
    /// @return uint256[] Array of update timestamps
    function _getRecords(
        address _patient
    ) private view returns (string[] memory, uint256[] memory) {
        DataEntry[] memory records = treatmentRecords[_patient];
        string[] memory dataHashes = new string[](records.length);
        uint256[] memory timestamps = new uint256[](records.length);

        for (uint i = 0; i < records.length; i++) {
            dataHashes[i] = records[i].dataHash;
            timestamps[i] = records[i].lastUpdated;
        }

        return (dataHashes, timestamps);
    }

    /// @notice Get anonymized treatment records for a patient (researcher access)
    /// @param _patient Address of the patient
    /// @return uint256[] Array of update timestamps
    function getAnonymizedRecords(
        address _patient
    ) public view returns (uint256[] memory) {
        if (!roleManager.hasRole(roleManager.RESEARCHER_ROLE(), msg.sender))
            revert NotAuthorized();
        return _getAnonymizedRecords(_patient);
    }

    /// @notice Get anonymized treatment records for a patient (builder access)
    /// @param _patient Address of the patient
    /// @return uint256[] Array of update timestamps
    function getBuilderRecords(
        address _patient
    ) public view returns (uint256[] memory) {
        if (!roleManager.hasRole(roleManager.BUILDER_ROLE(), msg.sender))
            revert NotAuthorized();
        return _getAnonymizedRecords(_patient);
    }

    /// @notice Internal function to get anonymized treatment records
    /// @param _patient Address of the patient
    /// @return uint256[] Array of update timestamps
    function _getAnonymizedRecords(
        address _patient
    ) private view returns (uint256[] memory) {
        DataEntry[] memory records = treatmentRecords[_patient];
        uint256[] memory timestamps = new uint256[](records.length);

        for (uint i = 0; i < records.length; i++) {
            timestamps[i] = records[i].lastUpdated;
        }

        return timestamps;
    }
}
