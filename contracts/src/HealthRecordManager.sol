// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {RoleManager} from "./RoleManager.sol";
import {MedicalRecords} from "./MedicalRecords.sol";
import {TemporaryAccess} from "./TemporaryAccess.sol";
import {UpdateApproval} from "./UpdateApproval.sol";
import {MaishaToken} from "./MaishaToken.sol";

/// @title HealthRecordManager
/// @notice Central contract for managing health records in the Maisha ecosystem
/// @dev Coordinates interactions between various health record components and token rewards
contract HealthRecordManager is AccessControl, Ownable {
    // Custom errors
    error NotAuthorized();
    error AlreadyOptedIn();
    error InvalidAddress();

    // Constants
    uint256 private constant OPT_IN_REWARD = 1000 * 10 ** 18; // 1000 tokens

    // Immutable variables
    MaishaToken public immutable maishaToken;
    MedicalRecords public immutable medicalRecords;
    RoleManager public immutable roleManager;
    TemporaryAccess public immutable temporaryAccess;
    UpdateApproval public immutable updateApproval;

    // State variables
    mapping(address => bool) public dataMonetizationOptIn;

    // Events
    event DataMonetizationOptIn(address indexed patient);
    event DataUpdateInitiated(
        address indexed patient,
        address indexed initiator,
        bytes32 updateId
    );
    event DataUpdateCompleted(
        address indexed patient,
        bytes32 indexed updateId
    );

    /// @notice Contract constructor
    /// @param _maishaToken Address of the MaishaToken contract
    /// @param _medicalRecords Address of the MedicalRecords contract
    /// @param _roleManager Address of the RoleManager contract
    /// @param _temporaryAccess Address of the TemporaryAccess contract
    /// @param _updateApproval Address of the UpdateApproval contract
    constructor(
        address _maishaToken,
        address _medicalRecords,
        address _roleManager,
        address _temporaryAccess,
        address _updateApproval
    ) Ownable(msg.sender) {
        if (
            _maishaToken == address(0) ||
            _medicalRecords == address(0) ||
            _roleManager == address(0) ||
            _temporaryAccess == address(0) ||
            _updateApproval == address(0)
        ) {
            revert InvalidAddress();
        }

        maishaToken = MaishaToken(_maishaToken);
        medicalRecords = MedicalRecords(_medicalRecords);
        roleManager = RoleManager(_roleManager);
        temporaryAccess = TemporaryAccess(_temporaryAccess);
        updateApproval = UpdateApproval(_updateApproval);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Check the role of an account
    /// @param account Address to check
    /// @return string The role of the account
    function checkRole(address account) public view returns (string memory) {
        if (roleManager.hasRole(roleManager.DOCTOR_ROLE(), account)) {
            return "Doctor";
        } else if (roleManager.hasRole(roleManager.PATIENT_ROLE(), account)) {
            return "Patient";
        } else if (
            roleManager.hasRole(roleManager.RESEARCHER_ROLE(), account)
        ) {
            return "Researcher";
        } else if (roleManager.hasRole(roleManager.BUILDER_ROLE(), account)) {
            return "Builder";
        } else {
            return "No Role";
        }
    }

    /// @notice Initiate a medical record update
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new data
    function initiateMedicalRecordUpdate(
        address _patient,
        string memory _dataHash
    ) public {
        bytes32 updateId = medicalRecords.initiateUpdate(_patient, _dataHash);
        emit DataUpdateInitiated(_patient, msg.sender, updateId);
    }

    /// @notice Approve an update
    /// @param _updateId Unique identifier of the update to be approved
    function approveUpdate(bytes32 _updateId) public {
        updateApproval.approveUpdate(_updateId);

        // Get the update details
        (, address patient, bytes32 dataHash, , , ) = updateApproval
            .getPendingUpdate(_updateId);

        // Convert bytes32 to string
        string memory dataHashString = bytes32ToString(dataHash);

        // Add the new medical record
        medicalRecords.addMedicalRecord(patient, dataHashString);

        emit DataUpdateCompleted(patient, _updateId);
    }

    /// @notice Get medical records for a patient (patient access)
    /// @param _patient Address of the patient
    /// @return string[] Array of data hashes
    /// @return uint256[] Array of update timestamps
    function getMedicalRecordsPatient(
        address _patient
    ) public returns (string[] memory, uint256[] memory) {
        return medicalRecords.getRecordsPatient(_patient);
    }

    /// @notice Get medical records for a patient (doctor access)
    /// @param _patient Address of the patient
    /// @return string[] Array of data hashes
    /// @return uint256[] Array of update timestamps
    function getMedicalRecordsDoctor(
        address _patient
    ) public returns (string[] memory, uint256[] memory) {
        return medicalRecords.getRecordsDoctor(_patient);
    }

    /// @notice Get anonymized medical records for a patient (researcher access)
    /// @param _patient Address of the patient
    /// @return uint256[] Array of update timestamps
    function getAnonymizedMedicalRecords(
        address _patient
    ) public returns (uint256[] memory) {
        return medicalRecords.getAnonymizedRecords(_patient);
    }

    /// @notice Get anonymized medical records for a patient (builder access)
    /// @param _patient Address of the patient
    /// @return uint256[] Array of update timestamps
    function getBuilderMedicalRecords(
        address _patient
    ) public returns (uint256[] memory) {
        return medicalRecords.getBuilderRecords(_patient);
    }

    /// @notice Opt in for data monetization
    function optInDataMonetization() public {
        if (!roleManager.hasRole(roleManager.PATIENT_ROLE(), msg.sender))
            revert NotAuthorized();
        if (dataMonetizationOptIn[msg.sender]) revert AlreadyOptedIn();

        dataMonetizationOptIn[msg.sender] = true;
        maishaToken.mint(msg.sender, OPT_IN_REWARD);
        emit DataMonetizationOptIn(msg.sender);
    }

    /// @notice Convert bytes32 to string
    /// @param _bytes32 The bytes32 to convert
    /// @return string The resulting string
    function bytes32ToString(
        bytes32 _bytes32
    ) internal pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}
