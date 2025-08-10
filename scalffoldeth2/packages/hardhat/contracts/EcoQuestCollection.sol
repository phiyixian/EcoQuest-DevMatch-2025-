// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EcoQuestCollection
 * @dev A simple contract to track collected NFTs for each user
 * This is not a full ERC721 implementation, but a tracking system for the game
 */
contract EcoQuestCollection {
    struct CollectedNFT {
        string name;
        string image;
        string rarity;
        uint256 timestamp;
        bool exists;
    }

    // Mapping from user address to their collected NFTs
    mapping(address => mapping(string => CollectedNFT)) public userCollections;

    // Mapping from user address to array of NFT names (for enumeration)
    mapping(address => string[]) public userNFTList;

    // Mapping to track if a user has collected a specific NFT
    mapping(address => mapping(string => bool)) public hasCollected;

    // Events
    event NFTCollected(address indexed user, string indexed nftName, string image, string rarity, uint256 timestamp);

    /**
     * @dev Collect an NFT for a user
     * @param user The address of the user collecting the NFT
     * @param name The name of the NFT
     * @param image The image URL of the NFT
     * @param rarity The rarity of the NFT
     */
    function collectNFT(address user, string memory name, string memory image, string memory rarity) external {
        require(user != address(0), "Invalid user address");
        require(bytes(name).length > 0, "NFT name cannot be empty");
        require(!hasCollected[user][name], "NFT already collected by user");

        // Add to user's collection
        userCollections[user][name] = CollectedNFT({
            name: name,
            image: image,
            rarity: rarity,
            timestamp: block.timestamp,
            exists: true
        });

        // Add to user's NFT list for enumeration
        userNFTList[user].push(name);

        // Mark as collected
        hasCollected[user][name] = true;

        emit NFTCollected(user, name, image, rarity, block.timestamp);
    }

    /**
     * @dev Get a specific NFT from a user's collection
     * @param user The user's address
     * @param name The name of the NFT
     * @return The NFT data
     */
    function getUserNFT(address user, string memory name) external view returns (CollectedNFT memory) {
        require(hasCollected[user][name], "NFT not collected by user");
        return userCollections[user][name];
    }

    /**
     * @dev Get all NFT names collected by a user
     * @param user The user's address
     * @return Array of NFT names
     */
    function getUserNFTList(address user) external view returns (string[] memory) {
        return userNFTList[user];
    }

    /**
     * @dev Get the number of NFTs collected by a user
     * @param user The user's address
     * @return The count of collected NFTs
     */
    function getUserNFTCount(address user) external view returns (uint256) {
        return userNFTList[user].length;
    }

    /**
     * @dev Check if a user has collected a specific NFT
     * @param user The user's address
     * @param name The name of the NFT
     * @return True if the user has collected the NFT
     */
    function hasUserCollected(address user, string memory name) external view returns (bool) {
        return hasCollected[user][name];
    }

    /**
     * @dev Get all collected NFTs for a user (with pagination)
     * @param user The user's address
     * @param offset Starting index
     * @param limit Maximum number of NFTs to return
     * @return Array of collected NFTs
     */
    function getUserNFTs(address user, uint256 offset, uint256 limit) external view returns (CollectedNFT[] memory) {
        string[] memory nftNames = userNFTList[user];
        uint256 total = nftNames.length;

        if (offset >= total) {
            return new CollectedNFT[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        uint256 length = end - offset;
        CollectedNFT[] memory result = new CollectedNFT[](length);

        for (uint256 i = 0; i < length; i++) {
            string memory nftName = nftNames[offset + i];
            result[i] = userCollections[user][nftName];
        }

        return result;
    }
}
