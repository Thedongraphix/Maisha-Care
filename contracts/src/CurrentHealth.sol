// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {BaseMedicalData} from "./BaseContracts/BaseMedicalData.sol";

/// @title CurrentHealth
/// @notice Manages current health data for patients
/// @dev Inherits from BaseMedicalData
contract CurrentHealth is BaseMedicalData {
    // State variables
    mapping(address => DataEntry) private currentHealths;

    constructor(
        address _roleManager,
        address _updateApproval,
        address _temporaryAccess
    ) BaseMedicalData(_roleManager, _updateApproval, _temporaryAccess) {}

    /// @notice Initiate a health update
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new health data
    /// @return updateId Unique identifier for the update request
    function initiateHealthUpdate(
        address _patient,
        string memory _dataHash
    ) public returns (bytes32) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NoTemporaryAccess();
        return initiateUpdate(_patient, _dataHash);
    }

    /// @notice Internal function to update health data
    /// @param _patient Address of the patient
    /// @param _dataHash New health data hash
    function _updateDataInternal(
        address _patient,
        string memory _dataHash
    ) internal override {
        currentHealths[_patient] = DataEntry(_dataHash, block.timestamp);
    }

    /// @notice Get health data for a patient (patient access)
    /// @param _patient Address of the patient
    /// @return string The health data hash
    /// @return uint256 The last update timestamp
    function getHealthPatient(
        address _patient
    ) public view returns (string memory, uint256) {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender))
            revert NotAuthorized();
        if (msg.sender != _patient) revert NotAuthorized();
        DataEntry memory health = currentHealths[_patient];
        return (health.dataHash, health.lastUpdated);
    }

    /// @notice Get health data for a patient (doctor access)
    /// @param _patient Address of the patient
    /// @return string The health data hash
    /// @return uint256 The last update timestamp
    function getHealthDoctor(
        address _patient
    ) public view returns (string memory, uint256) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender))
            revert NotAuthorized();
        if (!temporaryAccess.hasAccess(_patient, msg.sender))
            revert NoTemporaryAccess();
        DataEntry memory health = currentHealths[_patient];
        return (health.dataHash, health.lastUpdated);
    }

    /// @notice Get anonymized health data for a patient (researcher access)
    /// @param _patient Address of the patient
    /// @return uint256 The last update timestamp
    function getAnonymizedHealth(
        address _patient
    ) public view returns (uint256) {
        if (!roleManager.hasRole(roleManager.RESEARCHER_ROLE(), msg.sender))
            revert NotAuthorized();
        return currentHealths[_patient].lastUpdated;
    }

    /// @notice Get anonymized health data for a patient (builder access)
    /// @param _patient Address of the patient
    /// @return uint256 The last update timestamp
    function getBuilderHealth(address _patient) public view returns (uint256) {
        if (!roleManager.hasRole(roleManager.BUILDER_ROLE(), msg.sender))
            revert NotAuthorized();
        return currentHealths[_patient].lastUpdated;
    }
}
