// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title VerifiedAddressRegistry
/// @notice Manages verified addresses for roles with admin control
/// @dev Inherits from OpenZeppelin's AccessControl for role management
contract VerifiedAddressRegistry is AccessControl {
    // Custom errors
    error AddressAlreadyVerified();
    error AddressNotVerified();

    /// @notice Constants for predefined roles
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant PATIENT_ROLE = keccak256("patient");
    bytes32 public constant DOCTOR_ROLE = keccak256("doctor");
    bytes32 public constant RESEARCHER_ROLE = keccak256("researcher");
    bytes32 public constant BUILDER_ROLE = keccak256("builder");

    /// @notice Mapping to store verified addresses: role => address => isVerified
    mapping(bytes32 => mapping(address => bool)) private verifiedAddresses;

    /// @notice Emitted when an address is verified for a role
    /// @param role The role for which the address is verified
    /// @param account The address that was verified
    event AddressVerified(bytes32 indexed role, address indexed account);

    /// @notice Emitted when an address is unverified for a role
    /// @param role The role for which the address is unverified
    /// @param account The address that was unverified
    event AddressUnverified(bytes32 indexed role, address indexed account);

    /// @notice Contract constructor
    /// @dev Grants the ADMIN_ROLE to the contract deployer
    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Verify an address for a specific role
    /// @dev Reverts if the address is already verified for the given role
    /// @param role The role to verify the address for
    /// @param account The address to be verified
    function verifyAddress(bytes32 role, address account) public {
        if (verifiedAddresses[role][account]) revert AddressAlreadyVerified();

        verifiedAddresses[role][account] = true;
        emit AddressVerified(role, account);
    }

    /// @notice Unverify an address for a specific role
    /// @dev Only callable by addresses with the ADMIN_ROLE
    /// @dev Reverts if the address is not verified for the given role
    /// @param role The role to unverify the address for
    /// @param account The address to be unverified
    function unverifyAddress(
        bytes32 role,
        address account
    ) public onlyRole(ADMIN_ROLE) {
        if (!verifiedAddresses[role][account]) revert AddressNotVerified();

        verifiedAddresses[role][account] = false;
        emit AddressUnverified(role, account);
    }

    /// @notice Check if an address is verified for a specific role
    /// @param role The role to check verification for
    /// @param account The address to check
    /// @return bool True if the address is verified for the role, false otherwise
    function isVerified(
        bytes32 role,
        address account
    ) public view returns (bool) {
        return verifiedAddresses[role][account];
    }

    /// @notice Get the bytes32 representation of the PATIENT_ROLE
    /// @return bytes32 The PATIENT_ROLE identifier
    function getPatientRole() public pure returns (bytes32) {
        return PATIENT_ROLE;
    }

    /// @notice Get the bytes32 representation of the DOCTOR_ROLE
    /// @return bytes32 The DOCTOR_ROLE identifier
    function getDoctorRole() public pure returns (bytes32) {
        return DOCTOR_ROLE;
    }

    /// @notice Get the bytes32 representation of the RESEARCHER_ROLE
    /// @return bytes32 The RESEARCHER_ROLE identifier
    function getResearcherRole() public pure returns (bytes32) {
        return RESEARCHER_ROLE;
    }

    /// @notice Get the bytes32 representation of the BUILDER_ROLE
    /// @return bytes32 The BUILDER_ROLE identifier
    function getBuilderRole() public pure returns (bytes32) {
        return BUILDER_ROLE;
    }
}
