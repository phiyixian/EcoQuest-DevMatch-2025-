// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockUSDC.sol";

/**
 * @title EcoQuestDonation
 * @dev Manages carbon offset donations and tracking
 */
contract EcoQuestDonation {
    MockUSDC public usdcToken;
    address public klimadao;

    // Total donations received
    uint256 public totalDonations;

    // Total CO2 offset (in kg)
    uint256 public totalCO2Offset;

    // Donation struct
    struct Donation {
        address donor;
        uint256 amount;
        uint256 co2Offset;
        uint256 timestamp;
        string message;
    }

    // User stats
    struct UserStats {
        uint256 totalDonated;
        uint256 totalCO2Offset;
        uint256 donationCount;
    }

    // Events
    event DonationReceived(address indexed donor, uint256 amount, uint256 co2Offset, string message);

    //

    // Mappings
    mapping(address => UserStats) public userStats;
    mapping(uint256 => Donation) public donations;
    uint256 private _donationIds;

    constructor(address _usdcToken, address _klimadao) {
        usdcToken = MockUSDC(_usdcToken);
        klimadao = _klimadao;
    }

    function offset(uint256 amount, uint256 co2Offset, string memory message) external {
        require(amount > 0, "Amount must be greater than 0");
        require(co2Offset > 0, "CO2 offset must be greater than 0");
        bool success = usdcToken.transferFrom(msg.sender, klimadao, amount);
        require(success, "USDC transfer failed");

        _donationIds++;
        uint256 donationId = _donationIds;

        donations[donationId] = Donation({
            donor: msg.sender,
            amount: amount,
            co2Offset: co2Offset,
            timestamp: block.timestamp,
            message: message
        });

        userStats[msg.sender].totalDonated += amount;
        userStats[msg.sender].totalCO2Offset += co2Offset;
        userStats[msg.sender].donationCount++;

        totalDonations += amount;
        totalCO2Offset += co2Offset;

        emit DonationReceived(msg.sender, amount, co2Offset, message);
    }

    function getUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }

    function getDonation(uint256 donationId) external view returns (Donation memory) {
        require(donationId > 0 && donationId <= _donationIds, "Invalid donation ID");
        return donations[donationId];
    }

    function getTotalDonations() external view returns (uint256) {
        return _donationIds;
    }
}
