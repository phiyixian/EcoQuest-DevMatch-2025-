








// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockUSDC.sol";
import "./EcoQuestNFT.sol";

/**
 * @title EcoQuestDonation
 * @dev Manages carbon offset donations and tracking with NFT rewards
 */
contract EcoQuestDonation {
    MockUSDC public usdcToken;
    EcoQuestNFT public nftContract;
    address public klimadao;
    
    // Constants
    uint256 public constant NFT_THRESHOLD = 10000000; // 10 USDC (6 decimals)
    
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
        bool hasNFTReward; // Track if user already received NFT
    }
    
    // Events
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 co2Offset,
        string message
    );
    
    event NFTRewardMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        uint256 totalDonated
    );
    
    // Mappings
    mapping(address => UserStats) public userStats;
    mapping(uint256 => Donation) public donations;
    uint256 private _donationIds;
    
    constructor(address _usdcToken, address _klimadao, address _nftContract) {
        usdcToken = MockUSDC(_usdcToken);
        klimadao = _klimadao;
        nftContract = EcoQuestNFT(_nftContract);
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

        // Update user stats
        userStats[msg.sender].totalDonated += amount;
        userStats[msg.sender].totalCO2Offset += co2Offset;
        userStats[msg.sender].donationCount++;

        totalDonations += amount;
        totalCO2Offset += co2Offset;

        emit DonationReceived(msg.sender, amount, co2Offset, message);
        
        // Check if user qualifies for NFT reward
        _checkAndMintNFTReward(msg.sender);
    }
    
    /**
     * @dev Check if user qualifies for NFT reward and mint if eligible
     * @param user Address of the donor
     */
    function _checkAndMintNFTReward(address user) internal {
        UserStats storage stats = userStats[user];
        
        // Check if user has donated >= 10 USDC and hasn't received NFT yet
        if (stats.totalDonated >= NFT_THRESHOLD && !stats.hasNFTReward) {
            stats.hasNFTReward = true;
            
            try nftContract.mintDonationProof(
                user,
                stats.totalCO2Offset,
                stats.totalDonated
            ) returns (uint256 tokenId) {
                emit NFTRewardMinted(user, tokenId, stats.totalDonated);
            } catch {
                // If NFT minting fails, revert the flag so user can try again
                stats.hasNFTReward = false;
            }
        }
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