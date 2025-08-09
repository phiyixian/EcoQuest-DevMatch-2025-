// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EcoQuestNFT
 * @dev ERC721 NFT contract for EcoProof tokens
 */
contract EcoQuestNFT is ERC721, ERC721URIStorage, Ownable {

    uint256 private _tokenIds;
    
    // NFT types
    enum NFTType {
        DONATION_PROOF,
        RARE_DISCOVERY,
        QUEST_COMPLETION
    }
    
    // NFT metadata
    struct NFTMetadata {
        NFTType nftType;
        uint256 co2Offset;
        uint256 timestamp;
        string description;
        string imageURI;
    }
    
    // Mapping from token ID to metadata
    mapping(uint256 => NFTMetadata) public tokenMetadata;
    
    // Events
    event EcoProofMinted(
        address indexed to,
        uint256 indexed tokenId,
        NFTType nftType,
        uint256 co2Offset,
        string description
    );
    
    constructor() ERC721("EcoProof", "ECOP") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new EcoProof NFT
     * @param to Address to mint to
     * @param nftType Type of NFT
     * @param co2Offset CO2 offset amount
     * @param description Description of the NFT
     * @param imageURI IPFS URI of the image
     */
    function mintEcoProof(
        address to,
        NFTType nftType,
        uint256 co2Offset,
        string memory description,
        string memory imageURI
    ) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, imageURI);
        
        tokenMetadata[newTokenId] = NFTMetadata({
            nftType: nftType,
            co2Offset: co2Offset,
            timestamp: block.timestamp,
            description: description,
            imageURI: imageURI
        });
        
        emit EcoProofMinted(to, newTokenId, nftType, co2Offset, description);
        
        return newTokenId;
    }
    
    /**
     * @dev Mint donation proof NFT
     * @param to Address to mint to
     * @param co2Offset CO2 offset amount
     * @param donationAmount USDC donation amount
     */
    function mintDonationProof(
        address to,
        uint256 co2Offset,
        uint256 donationAmount
    ) external onlyOwner returns (uint256) {
        string memory description = string(abi.encodePacked(
            "Proof of Carbon Offset: ",
            _uint2str(co2Offset),
            " kg CO2 offset with ",
            _uint2str(donationAmount),
            " USDC donation"
        ));
        
        return mintEcoProof(
            to,
            NFTType.DONATION_PROOF,
            co2Offset,
            description,
            "ipfs://QmDonationProof" // Placeholder IPFS URI
        );
    }
    
    /**
     * @dev Mint rare discovery NFT
     * @param to Address to mint to
     * @param discoveryName Name of the discovery
     * @param rarityLevel Rarity level (1-5)
     */
    function mintRareDiscovery(
        address to,
        string memory discoveryName,
        uint256 rarityLevel
    ) external onlyOwner returns (uint256) {
        string memory description = string(abi.encodePacked(
            "Rare Discovery: ",
            discoveryName,
            " (Rarity Level: ",
            _uint2str(rarityLevel),
            ")"
        ));
        
        return mintEcoProof(
            to,
            NFTType.RARE_DISCOVERY,
            0, // No CO2 offset for discoveries
            description,
            "ipfs://QmRareDiscovery" // Placeholder IPFS URI
        );
    }
    
    /**
     * @dev Get NFT metadata
     * @param tokenId Token ID
     */
    function getNFTMetadata(uint256 tokenId) external view returns (NFTMetadata memory) {
        require(tokenId > 0 && tokenId <= _tokenIds, "Token does not exist");
        return tokenMetadata[tokenId];
    }
    
    /**
     * @dev Get total number of NFTs minted
     */
    function getTotalMinted() external view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Get NFTs owned by an address
     * @param owner Address to check
     */
    function getNFTsByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        
        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (ownerOf(i) == owner) {
                tokenIds[index] = i;
                index++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Convert uint to string
     * @param _i Number to convert
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        
        uint256 j = _i;
        uint256 length;
        
        while (j != 0) {
            length++;
            j /= 10;
        }
        
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        
        while (_i != 0) {
            k -= 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        
        return string(bstr);
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 