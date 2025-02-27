// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {BaseMedicalData} from "./BaseContracts/BaseMedicalData.sol";

/// @title PersonalInfo
/// @notice Manages personal information for patients
/// @dev Inherits from BaseMedicalData
contract PersonalInfo is BaseMedicalData {
    // State variables
    mapping(address => DataEntry) private personalInfo;

    constructor(
        address _roleManager,
        address _updateApproval,
        address _temporaryAccess
    ) BaseMedicalData(_roleManager, _updateApproval, _temporaryAccess) {}

    /// @notice Initiate a personal info update
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new personal info
    /// @return updateId Unique identifier for the update request
    function initiateInfoUpdate(
        address _patient,
        string memory _dataHash
    ) public returns (bytes32) {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender))
            revert NotAuthorized();
        if (msg.sender != _patient) revert NotAuthorized();
        return initiateUpdate(_patient, _dataHash);
    }

    /// @notice Internal function to update personal info
    /// @param _patient Address of the patient
    /// @param _dataHash New personal info hash
    function _updateDataInternal(
        address _patient,
        string memory _dataHash
    ) internal override {
        personalInfo[_patient] = DataEntry(_dataHash, block.timestamp);
    }

    /// @notice Get personal info for a patient
    /// @param _patient Address of the patient
    /// @return string The personal info hash
    /// @return uint256 The last update timestamp
    function getInfo(
        address _patient
    ) public view returns (string memory, uint256) {
        if (
            !roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender) &&
            !roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender)
        ) revert NotAuthorized();
        if (
            roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender) &&
            !temporaryAccess.hasAccess(_patient, msg.sender)
        ) revert NoTemporaryAccess();
        DataEntry memory info = personalInfo[_patient];
        return (info.dataHash, info.lastUpdated);
    }

    /// @notice Get anonymized personal info for a patient (researcher access)
    /// @param _patient Address of the patient
    /// @return uint256 The last update timestamp
    function getAnonymizedInfo(address _patient) public view returns (uint256) {
        if (!roleManager.hasRole(roleManager.RESEARCHER_ROLE(), msg.sender))
            revert NotAuthorized();
        return personalInfo[_patient].lastUpdated;
    }

    /// @notice Get anonymized personal info for a patient (builder access)
    /// @param _patient Address of the patient
    /// @return uint256 The last update timestamp
    function getBuilderInfo(address _patient) public view returns (uint256) {
        if (!roleManager.hasRole(roleManager.BUILDER_ROLE(), msg.sender))
            revert NotAuthorized();
        return personalInfo[_patient].lastUpdated;
    }
}
