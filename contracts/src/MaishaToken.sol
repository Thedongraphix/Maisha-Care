// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title MaishaToken
/// @notice ERC20 token for the Maisha ecosystem
/// @dev Inherits from OpenZeppelin's ERC20 and Ownable contracts
contract MaishaToken is ERC20, Ownable {
    // Custom errors
    error NotAuthorized();
    error InvalidAmount();

    // Constants
    uint256 private constant INITIAL_SUPPLY = 500000000 * 10 ** 18; // 500 million tokens with 18 decimals
    uint256 private constant MAX_SUPPLY = 1000000000 * 10 ** 18; // 1 billion tokens max supply

    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /// @notice Contract constructor
    /// @dev Mints the initial supply to the contract deployer
    constructor() ERC20("MaishaToken", "MSHA") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /// @notice Mint new tokens
    /// @dev Only the contract owner can mint new tokens
    /// @param to Address to receive the minted tokens
    /// @param amount Amount of tokens to mint
    function mint(address to, uint256 amount) public onlyOwner {
        if (to == address(0)) revert InvalidAmount();
        if (amount == 0) revert InvalidAmount();
        if (totalSupply() + amount > MAX_SUPPLY) revert InvalidAmount();

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /// @notice Burn tokens
    /// @dev Any token holder can burn their own tokens
    /// @param amount Amount of tokens to burn
    function burn(uint256 amount) public {
        if (amount == 0) revert InvalidAmount();
        if (amount > balanceOf(msg.sender)) revert InvalidAmount();

        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /// @notice Get the maximum supply of tokens
    /// @return uint256 The maximum supply of tokens
    function maxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }

    /// @notice Get the remaining mintable supply of tokens
    /// @return uint256 The remaining mintable supply of tokens
    function remainingMintableSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}
