// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {RoleManager} from "./RoleManager.sol";

/// @title UpdateApproval
/// @notice Manages the approval process for updating medical records
/// @dev Uses RoleManager for role-based access control
contract UpdateApproval {
    // Custom errors
    error UpdateDoesNotExist();
    error NotAuthorized();
    error AlreadyApproved();

    struct PendingUpdate {
        address doctor;
        address patient;
        bytes32 dataHash;
        uint256 timestamp;
        bool doctorApproved;
        bool patientApproved;
    }

    // Immutable variables
    RoleManager public immutable roleManager;

    // State variables
    mapping(bytes32 => PendingUpdate) public pendingUpdates;

    // Events
    event UpdateInitiated(
        bytes32 indexed updateId,
        address indexed doctor,
        address indexed patient
    );
    event UpdateApproved(bytes32 indexed updateId, address indexed approver);
    event UpdateCompleted(bytes32 indexed updateId);

    /// @notice Contract constructor
    /// @param _roleManager Address of the RoleManager contract
    constructor(address _roleManager) {
        roleManager = RoleManager(_roleManager);
    }

    /// @notice Initiate an update for a patient's medical record
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the data to be updated
    /// @return updateId Unique identifier for the initiated update
    function initiateUpdate(
        address _patient,
        bytes32 _dataHash
    ) public returns (bytes32) {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender)) {
            revert NotAuthorized();
        }

        bytes32 updateId = keccak256(
            abi.encodePacked(msg.sender, _patient, _dataHash, block.timestamp)
        );
        pendingUpdates[updateId] = PendingUpdate({
            doctor: msg.sender,
            patient: _patient,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            doctorApproved: true,
            patientApproved: false
        });

        emit UpdateInitiated(updateId, msg.sender, _patient);
        emit UpdateApproved(updateId, msg.sender);
        return updateId;
    }

    /// @notice Approve an update
    /// @param _updateId Unique identifier of the update to be approved
    function approveUpdate(bytes32 _updateId) public {
        PendingUpdate storage update = pendingUpdates[_updateId];
        if (update.timestamp == 0) {
            revert UpdateDoesNotExist();
        }

        if (msg.sender == update.patient && !update.patientApproved) {
            update.patientApproved = true;
        } else if (msg.sender == update.doctor && !update.doctorApproved) {
            update.doctorApproved = true;
        } else {
            revert AlreadyApproved();
        }

        emit UpdateApproved(_updateId, msg.sender);

        if (update.doctorApproved && update.patientApproved) {
            emit UpdateCompleted(_updateId);
        }
    }

    /// @notice Check if an update is fully approved
    /// @param _updateId Unique identifier of the update
    /// @return bool True if the update is fully approved, false otherwise
    function isApproved(bytes32 _updateId) public view returns (bool) {
        PendingUpdate storage update = pendingUpdates[_updateId];
        return update.doctorApproved && update.patientApproved;
    }

    /// @notice Get details of a pending update
    /// @param _updateId Unique identifier of the update
    /// @return doctor Address of the doctor who initiated the update
    /// @return patient Address of the patient
    /// @return dataHash Hash of the data to be updated
    /// @return timestamp Timestamp of when the update was initiated
    /// @return doctorApproved Whether the doctor has approved the update
    /// @return patientApproved Whether the patient has approved the update
    function getPendingUpdate(
        bytes32 _updateId
    )
        public
        view
        returns (
            address doctor,
            address patient,
            bytes32 dataHash,
            uint256 timestamp,
            bool doctorApproved,
            bool patientApproved
        )
    {
        PendingUpdate storage update = pendingUpdates[_updateId];
        return (
            update.doctor,
            update.patient,
            update.dataHash,
            update.timestamp,
            update.doctorApproved,
            update.patientApproved
        );
    }
}
