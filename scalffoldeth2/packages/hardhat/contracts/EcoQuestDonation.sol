// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EcoQuestDonation
 * @dev Manages carbon offset donations and tracking
 */
contract EcoQuestDonation is Ownable {

    // USDC token contract on Optimism Goerli
    IERC20 public usdcToken;
    
    // Carbon offset rate (USDC per kg CO2)
    uint256 public carbonOffsetRate;
    
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
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 co2Offset,
        string message
    );
    
    event CarbonOffsetRateUpdated(uint256 newRate);
    
    // Mappings
    mapping(address => UserStats) public userStats;
    mapping(uint256 => Donation) public donations;
    uint256 private _donationIds;
    
    constructor(
        address _usdcToken,
        uint256 _carbonOffsetRate
    ) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        carbonOffsetRate = _carbonOffsetRate;
    }
    
    /**
     * @dev Make a donation in USDC
     * @param amount Amount of USDC to donate
     * @param message Optional message with donation
     */
    function donate(uint256 amount, string memory message) external {
        require(amount > 0, "Donation amount must be greater than 0");
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        
        uint256 co2Offset = (amount * 1e18) / carbonOffsetRate; // Convert to kg CO2
        
        _donationIds++;
        uint256 donationId = _donationIds;
        
        donations[donationId] = Donation({
            donor: msg.sender,
            amount: amount,
            co2Offset: co2Offset,
            timestamp: block.timestamp,
            message: message
        });
        
        // Update user stats
        userStats[msg.sender].totalDonated += amount;
        userStats[msg.sender].totalCO2Offset += co2Offset;
        userStats[msg.sender].donationCount++;
        
        // Update global stats
        totalDonations += amount;
        totalCO2Offset += co2Offset;
        
        emit DonationReceived(msg.sender, amount, co2Offset, message);
    }
    
    /**
     * @dev Get user stats
     * @param user Address of the user
     */
    function getUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }
    
    /**
     * @dev Get donation by ID
     * @param donationId ID of the donation
     */
    function getDonation(uint256 donationId) external view returns (Donation memory) {
        require(donationId > 0 && donationId <= _donationIds, "Invalid donation ID");
        return donations[donationId];
    }
    
    /**
     * @dev Get total number of donations
     */
    function getTotalDonations() external view returns (uint256) {
        return _donationIds;
    }
    
    /**
     * @dev Update carbon offset rate (only owner)
     * @param newRate New rate in USDC per kg CO2
     */
    function updateCarbonOffsetRate(uint256 newRate) external onlyOwner {
        carbonOffsetRate = newRate;
        emit CarbonOffsetRateUpdated(newRate);
    }
    
    /**
     * @dev Withdraw USDC from contract (only owner)
     * @param amount Amount to withdraw
     * @param recipient Address to send USDC to
     */
    function withdrawUSDC(uint256 amount, address recipient) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient");
        require(
            usdcToken.transfer(recipient, amount),
            "USDC transfer failed"
        );
    }
    
    /**
     * @dev Calculate CO2 offset for a given USDC amount
     * @param usdcAmount Amount of USDC
     */
    function calculateCO2Offset(uint256 usdcAmount) external view returns (uint256) {
        return (usdcAmount * 1e18) / carbonOffsetRate;
    }
} 