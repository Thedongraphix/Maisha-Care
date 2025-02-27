// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {RoleManager} from "../../src/RoleManager.sol";
import {UpdateApproval} from "../../src/UpdateApproval.sol";
import {TemporaryAccess} from "../../src/TemporaryAccess.sol";

/// @title BaseMedicalData
/// @notice Base contract for managing medical data
/// @dev To be inherited by specific medical data contracts
abstract contract BaseMedicalData is Ownable {
    // Custom errors
    error NotAuthorized();
    error InvalidDataHash();
    error UpdateNotApproved();
    error NoTemporaryAccess();

    struct DataEntry {
        string dataHash;
        uint256 lastUpdated;
    }

    // Immutable variables
    RoleManager public immutable roleManager;
    UpdateApproval public immutable updateApproval;
    TemporaryAccess public immutable temporaryAccess;

    // Events
    event DataUpdateInitiated(
        address indexed patient,
        address indexed initiator,
        bytes32 updateId
    );
    event DataUpdated(address indexed patient, uint256 timestamp);

    constructor(
        address _roleManager,
        address _updateApproval,
        address _temporaryAccess
    ) Ownable(msg.sender) {
        roleManager = RoleManager(_roleManager);
        updateApproval = UpdateApproval(_updateApproval);
        temporaryAccess = TemporaryAccess(_temporaryAccess);
    }

    /// @notice Initiate a data update
    /// @param _patient Address of the patient
    /// @param _dataHash Hash of the new data
    /// @return updateId Unique identifier for the update request
    function initiateUpdate(
        address _patient,
        string memory _dataHash
    ) public virtual returns (bytes32) {
        if (bytes(_dataHash).length == 0) revert InvalidDataHash();
        bytes32 updateId = updateApproval.initiateUpdate(
            _patient,
            keccak256(abi.encodePacked(_dataHash))
        );
        emit DataUpdateInitiated(_patient, msg.sender, updateId);
        return updateId;
    }

    /// @notice Update the data after approval
    /// @param _updateId Unique identifier of the approved update
    function updateData(bytes32 _updateId) public virtual {
        if (!updateApproval.isApproved(_updateId)) revert UpdateNotApproved();
        (
            address initiator,
            address patient,
            bytes32 dataHash,
            ,
            ,

        ) = updateApproval.getPendingUpdate(_updateId);
        if (msg.sender != initiator) revert NotAuthorized();

        _updateDataInternal(patient, bytes32ToString(dataHash));
        emit DataUpdated(patient, block.timestamp);
    }

    /// @notice Internal function to update data
    /// @param _patient Address of the patient
    /// @param _dataHash New data hash
    function _updateDataInternal(
        address _patient,
        string memory _dataHash
    ) internal virtual;

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
