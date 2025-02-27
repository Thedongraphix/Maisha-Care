// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {BaseMedicalData} from "./BaseContracts/BaseMedicalData.sol";

/// @title MedicalHistory
/// @notice Manages medical history for patients
/// @dev Inherits from BaseMedicalData
contract MedicalHistory is BaseMedicalData {
    // State variables
    mapping(address => DataEntry) private medicalHistories;

    constructor(
        address _roleManager,
        address _updateApproval,
        address _temporaryAccess
    ) BaseMedicalData(_roleManager, _updateApproval, _temporaryAccess) {}

    /// @notice Initiate a medical history update
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new medical history data
    /// @return updateId Unique identifier for the update request
    function initiateHistoryUpdate(
        address _patient,
        string memory _dataHash
    ) public returns (bytes32) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NoTemporaryAccess();
        return initiateUpdate(_patient, _dataHash);
    }

    /// @notice Internal function to update medical history data
    /// @param _patient Address of the patient
    /// @param _dataHash New medical history data hash
    function _updateDataInternal(
        address _patient,
        string memory _dataHash
    ) internal override {
        medicalHistories[_patient] = DataEntry(_dataHash, block.timestamp);
    }

    /// @notice Get medical history for a patient (patient access)
    /// @param _patient Address of the patient
    /// @return string The medical history data hash
    /// @return uint256 The last update timestamp
    function getHistoryPatient(
        address _patient
    ) public view returns (string memory, uint256) {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender))
            revert NotAuthorized();
        if (msg.sender != _patient) revert NotAuthorized();
        DataEntry memory history = medicalHistories[_patient];
        return (history.dataHash, history.lastUpdated);
    }

    /// @notice Get medical history for a patient (doctor access)
    /// @param _patient Address of the patient
    /// @return string The medical history data hash
    /// @return uint256 The last update timestamp
    function getHistoryDoctor(
        address _patient
    ) public view returns (string memory, uint256) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NoTemporaryAccess();
        DataEntry memory history = medicalHistories[_patient];
        return (history.dataHash, history.lastUpdated);
    }

    /// @notice Get anonymized medical history for a patient (researcher access)
    /// @param _patient Address of the patient
    /// @return uint256 The last update timestamp
    function getAnonymizedHistory(
        address _patient
    ) public view returns (uint256) {
        if (!roleManager.hasRole(roleManager.RESEARCHER_ROLE(), msg.sender))
            revert NotAuthorized();
        return medicalHistories[_patient].lastUpdated;
    }

    /// @notice Get anonymized medical history for a patient (builder access)
    /// @param _patient Address of the patient
    /// @return uint256 The last update timestamp
    function getBuilderHistory(address _patient) public view returns (uint256) {
        if (!roleManager.hasRole(roleManager.BUILDER_ROLE(), msg.sender))
            revert NotAuthorized();
        return medicalHistories[_patient].lastUpdated;
    }
}
