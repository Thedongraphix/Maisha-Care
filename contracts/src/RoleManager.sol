// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {VerifiedAddressRegistry} from "./VerifiedAddressRegistry.sol";

/// @title RoleManager
/// @notice Manages role assignments with admin control and verification
/// @dev Inherits from OpenZeppelin's AccessControl for role management
contract RoleManager is AccessControl {
    // Custom errors
    error NotVerified(bytes32 role);
    error AlreadyRegistered(bytes32 role);

    // Constants for roles
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant PATIENT_ROLE = keccak256("patient");
    bytes32 public constant DOCTOR_ROLE = keccak256("doctor");
    bytes32 public constant RESEARCHER_ROLE = keccak256("researcher");
    bytes32 public constant BUILDER_ROLE = keccak256("builder");

    // Immutable variable for VerifiedAddressRegistry
    VerifiedAddressRegistry public immutable verifiedRegistry;

    // Events
    event SuccessfullyRegistered(address indexed account, bytes32 indexed role);

    /// @notice Contract constructor
    /// @param _verifiedRegistry Address of the VerifiedAddressRegistry contract
    constructor(address _verifiedRegistry) {
        _grantRole(ADMIN_ROLE, msg.sender);
        verifiedRegistry = VerifiedAddressRegistry(_verifiedRegistry);
    }

    /// @notice Register as a patient
    /// @dev Requires verification in VerifiedAddressRegistry
    function registerAsPatient() external {
        _registerRole(PATIENT_ROLE);
    }

    /// @notice Register as a doctor
    /// @dev Requires verification in VerifiedAddressRegistry
    function registerAsDoctor() external {
        _registerRole(DOCTOR_ROLE);
    }

    /// @notice Register as a researcher
    /// @dev Requires verification in VerifiedAddressRegistry
    function registerAsResearcher() external {
        _registerRole(RESEARCHER_ROLE);
    }

    /// @notice Register as a builder
    /// @dev Requires verification in VerifiedAddressRegistry
    function registerAsBuilder() external {
        _registerRole(BUILDER_ROLE);
    }

    /// @notice Internal function to register a role
    /// @param role The role to register
    function _registerRole(bytes32 role) internal {
        if (!verifiedRegistry.isVerified(role, msg.sender)) {
            revert NotVerified(role);
        }
        if (hasRole(role, msg.sender)) {
            revert AlreadyRegistered(role);
        }
        _grantRole(role, msg.sender);
        emit SuccessfullyRegistered(msg.sender, role);
    }

    /// @notice Grant a role to an account (admin only)
    /// @param role The role identifier
    /// @param account The address to grant the role to
    function grantRole(
        bytes32 role,
        address account
    ) public override onlyRole(ADMIN_ROLE) {
        if (!verifiedRegistry.isVerified(role, account)) {
            revert NotVerified(role);
        }
        _grantRole(role, account);
    }

    /// @notice Revoke a role from an account (admin only)
    /// @param role The role identifier
    /// @param account The address to revoke the role from
    function revokeRole(
        bytes32 role,
        address account
    ) public override onlyRole(ADMIN_ROLE) {
        _revokeRole(role, account);
    }
}
