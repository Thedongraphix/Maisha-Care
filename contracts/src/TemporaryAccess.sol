// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {RoleManager} from "./RoleManager.sol";

/// @title TemporaryAccess
/// @notice Manages temporary access rights for doctors to patient data
/// @dev Uses RoleManager for role-based access control
contract TemporaryAccess {
    // Custom errors
    error NotAuthorized();
    error InvalidAddress();
    error NoPendingRequest();
    error AccessNotGranted();

    // Constants
    uint256 private constant ACCESS_DURATION = 10 minutes;

    // Immutable variables
    RoleManager public immutable roleManager;

    // State variables
    mapping(address => mapping(address => uint256)) public accessExpiry;
    mapping(address => mapping(address => bool)) public researchAccess;
    mapping(address => mapping(address => bool)) public builderAccess;
    mapping(address => mapping(address => bool)) public pendingAccessRequests;

    // Events
    event AccessRequested(address indexed doctor, address indexed patient);
    event AccessApproved(
        address indexed patient,
        address indexed doctor,
        uint256 expiryTime
    );
    event AccessDenied(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    event ResearchAccessGranted(
        address indexed patient,
        address indexed researcher
    );
    event BuilderAccessGranted(
        address indexed patient,
        address indexed builder
    );

    /// @notice Contract constructor
    /// @param _roleManager Address of the RoleManager contract
    constructor(address _roleManager) {
        roleManager = RoleManager(_roleManager);
    }

    /// @notice Request access to a patient's data
    /// @param _patient Address of the patient
    function requestAccess(address _patient) external {
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), msg.sender)) {
            revert NotAuthorized();
        }
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), _patient)) {
            revert InvalidAddress();
        }
        pendingAccessRequests[_patient][msg.sender] = true;
        emit AccessRequested(msg.sender, _patient);
    }

    /// @notice Approve access for a doctor
    /// @param _doctor Address of the doctor
    function approveAccess(address _doctor) external {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender)) {
            revert NotAuthorized();
        }
        if (!roleManager.hasRole(roleManager.DOCTOR_ROLE(), _doctor)) {
            revert InvalidAddress();
        }
        if (!pendingAccessRequests[msg.sender][_doctor]) {
            revert NoPendingRequest();
        }
        uint256 expiryTime = block.timestamp + ACCESS_DURATION;
        accessExpiry[msg.sender][_doctor] = expiryTime;
        delete pendingAccessRequests[msg.sender][_doctor];
        emit AccessApproved(msg.sender, _doctor, expiryTime);
    }

    /// @notice Deny access for a doctor
    /// @param _doctor Address of the doctor
    function denyAccess(address _doctor) external {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender)) {
            revert NotAuthorized();
        }
        delete accessExpiry[msg.sender][_doctor];
        delete pendingAccessRequests[msg.sender][_doctor];
        emit AccessDenied(msg.sender, _doctor);
    }

    /// @notice Revoke access for a doctor
    /// @param _doctor Address of the doctor
    function revokeAccess(address _doctor) external {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender)) {
            revert NotAuthorized();
        }
        delete accessExpiry[msg.sender][_doctor];
        emit AccessRevoked(msg.sender, _doctor);
    }

    /// @notice Check if a doctor has access to a patient's data
    /// @param _patient Address of the patient
    /// @param _doctor Address of the doctor
    /// @return bool True if the doctor has access, false otherwise
    function hasAccess(
        address _patient,
        address _doctor
    ) public view returns (bool) {
        return block.timestamp < accessExpiry[_patient][_doctor];
    }

    /// @notice Grant research access to a researcher
    /// @param _researcher Address of the researcher
    function grantResearchAccess(address _researcher) external {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender)) {
            revert NotAuthorized();
        }
        if (!roleManager.hasRole(roleManager.RESEARCHER_ROLE(), _researcher)) {
            revert InvalidAddress();
        }
        researchAccess[msg.sender][_researcher] = true;
        emit ResearchAccessGranted(msg.sender, _researcher);
    }

    /// @notice Grant builder access to a builder
    /// @param _builder Address of the builder
    function grantBuilderAccess(address _builder) external {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender)) {
            revert NotAuthorized();
        }
        if (!roleManager.hasRole(roleManager.BUILDER_ROLE(), _builder)) {
            revert InvalidAddress();
        }
        builderAccess[msg.sender][_builder] = true;
        emit BuilderAccessGranted(msg.sender, _builder);
    }

    /// @notice Check if a researcher has access to a patient's data
    /// @param _patient Address of the patient
    /// @param _researcher Address of the researcher
    /// @return bool True if the researcher has access, false otherwise
    function hasResearchAccess(
        address _patient,
        address _researcher
    ) public view returns (bool) {
        return researchAccess[_patient][_researcher];
    }

    /// @notice Check if a builder has access to a patient's data
    /// @param _patient Address of the patient
    /// @param _builder Address of the builder
    /// @return bool True if the builder has access, false otherwise
    function hasBuilderAccess(
        address _patient,
        address _builder
    ) public view returns (bool) {
        return builderAccess[_patient][_builder];
    }
}
