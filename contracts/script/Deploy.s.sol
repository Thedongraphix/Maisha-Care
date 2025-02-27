// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {VerifiedAddressRegistry} from "../src/VerifiedAddressRegistry.sol";
import {RoleManager} from "../src/RoleManager.sol";
import {UpdateApproval} from "../src/UpdateApproval.sol";
import {MedicalRecords} from "../src/MedicalRecords.sol";
import {TemporaryAccess} from "../src/TemporaryAccess.sol";
import {HealthRecordManager} from "../src/HealthRecordManager.sol";
import {MaishaToken} from "../src/MaishaToken.sol";

contract DeployScript is Script {
    VerifiedAddressRegistry public verifiedRegistry;
    RoleManager public roleManager;
    UpdateApproval public updateApproval;
    MedicalRecords public medicalRecords;
    TemporaryAccess public temporaryAccess;
    HealthRecordManager public healthRecordManager;
    MaishaToken public maishaToken;

    function setUp() public {}

    function run() public {
        // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy contracts in order
        deployContracts();

        // Set up contract relationships and transfer ownership
        setupContractRelationships();

        // Stop broadcasting transactions
        vm.stopBroadcast();

        // Log deployed addresses
        logDeployedAddresses();
    }

    /// @notice Deploy all contracts in the correct order
    function deployContracts() private {
        console.log("Deploying VerifiedAddressRegistry...");
        verifiedRegistry = new VerifiedAddressRegistry();

        console.log("Deploying RoleManager...");
        roleManager = new RoleManager(address(verifiedRegistry));

        console.log("Deploying UpdateApproval...");
        updateApproval = new UpdateApproval(address(roleManager));

        console.log("Deploying TemporaryAccess...");
        temporaryAccess = new TemporaryAccess(address(roleManager));

        console.log("Deploying MedicalRecords...");
        medicalRecords = new MedicalRecords(
            address(roleManager),
            address(updateApproval),
            address(temporaryAccess)
        );

        console.log("Deploying MaishaToken...");
        maishaToken = new MaishaToken();

        console.log("Deploying HealthRecordManager...");
        healthRecordManager = new HealthRecordManager(
            address(maishaToken),
            address(medicalRecords),
            address(roleManager),
            address(temporaryAccess),
            address(updateApproval)
        );
    }

    /// @notice Set up relationships between contracts and transfer ownership where necessary
    function setupContractRelationships() private {
        console.log(
            "Setting up contract relationships and transferring ownership..."
        );

        // Transfer ownership of MedicalRecords to HealthRecordManager
        medicalRecords.transferOwnership(address(healthRecordManager));

        // Transfer ownership of MaishaToken to HealthRecordManager
        maishaToken.transferOwnership(address(healthRecordManager));
    }

    /// @notice Log the addresses of all deployed contracts
    function logDeployedAddresses() private view {
        console.log("Deployed contract addresses:");
        console.log(
            "VerifiedAddressRegistry deployed to:",
            address(verifiedRegistry)
        );
        console.log("RoleManager deployed to:", address(roleManager));
        console.log("UpdateApproval deployed to:", address(updateApproval));
        console.log("MaishaToken deployed to:", address(maishaToken));
        console.log("MedicalRecords deployed to:", address(medicalRecords));
        console.log("TemporaryAccess deployed to:", address(temporaryAccess));
        console.log(
            "HealthRecordManager deployed to:",
            address(healthRecordManager)
        );
    }
}