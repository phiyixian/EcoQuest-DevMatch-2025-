// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ArbitrumBridge
 * @dev A simplified bridge contract for bridging ETH from Ethereum L1 to Arbitrum L2
 * @notice This is a demonstration contract for testnet use
 */
contract ArbitrumBridge {
    address public owner;
    uint256 public bridgeFee; // Fee in wei (e.g., 0.001 ETH)
    bool public bridgeActive;
    uint256 public totalBridged;
    uint256 public transactionCounter;

    struct BridgeTransaction {
        address user;
        uint256 ethAmount;
        string arbitrumRecipient; // Arbitrum address as string
        uint256 timestamp;
        bool processed;
    }

    mapping(uint256 => BridgeTransaction) public bridgeTransactions;
    mapping(address => uint256[]) public userTransactions;

    event BridgeInitiated(
        uint256 indexed transactionId,
        address indexed user,
        uint256 ethAmount,
        string arbitrumRecipient,
        uint256 timestamp
    );

    event BridgeProcessed(uint256 indexed transactionId, address indexed user, uint256 ethAmount);

    event BridgeFeeUpdated(uint256 newFee);
    event BridgeStatusUpdated(bool status);
    event FeesWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier bridgeIsActive() {
        require(bridgeActive, "Bridge is currently inactive");
        _;
    }

    constructor(uint256 _bridgeFee) {
        owner = msg.sender;
        bridgeFee = _bridgeFee; // e.g., 0.001 ether
        bridgeActive = true;
    }

    /**
     * @dev Bridge ETH to Arbitrum
     * @param arbitrumRecipient The recipient address on Arbitrum (as string)
     * @notice Sends ETH to be bridged to Arbitrum L2
     */
    function bridgeToArbitrum(string memory arbitrumRecipient) external payable bridgeIsActive {
        require(msg.value > bridgeFee, "Amount must be greater than bridge fee");
        require(bytes(arbitrumRecipient).length > 0, "Arbitrum recipient address required");

        uint256 ethToBridge = msg.value - bridgeFee;
        uint256 transactionId = transactionCounter++;

        bridgeTransactions[transactionId] = BridgeTransaction({
            user: msg.sender,
            ethAmount: ethToBridge,
            arbitrumRecipient: arbitrumRecipient,
            timestamp: block.timestamp,
            processed: false
        });

        userTransactions[msg.sender].push(transactionId);
        totalBridged += ethToBridge;

        emit BridgeInitiated(transactionId, msg.sender, ethToBridge, arbitrumRecipient, block.timestamp);
    }

    /**
     * @dev Process a bridge transaction (owner only - simulates L2 processing)
     * @param transactionId The transaction ID to process
     */
    function processBridgeTransaction(uint256 transactionId) external onlyOwner {
        BridgeTransaction storage transaction = bridgeTransactions[transactionId];
        require(!transaction.processed, "Transaction already processed");
        require(transaction.user != address(0), "Transaction does not exist");

        transaction.processed = true;

        emit BridgeProcessed(transactionId, transaction.user, transaction.ethAmount);
    }

    /**
     * @dev Get bridge transaction details
     * @param transactionId The transaction ID
     * @return The bridge transaction details
     */
    function getBridgeTransaction(uint256 transactionId) external view returns (BridgeTransaction memory) {
        return bridgeTransactions[transactionId];
    }

    /**
     * @dev Get user's bridge transaction IDs
     * @param user The user address
     * @return Array of transaction IDs
     */
    function getUserTransactions(address user) external view returns (uint256[] memory) {
        return userTransactions[user];
    }

    /**
     * @dev Get total number of transactions
     * @return The total transaction count
     */
    function getTotalTransactions() external view returns (uint256) {
        return transactionCounter;
    }

    /**
     * @dev Get bridge statistics
     * @return totalBridged, totalTransactions, bridgeFee, bridgeActive
     */
    function getBridgeStats() external view returns (uint256, uint256, uint256, bool) {
        return (totalBridged, transactionCounter, bridgeFee, bridgeActive);
    }

    // Owner functions

    /**
     * @dev Update bridge fee (owner only)
     * @param _newFee The new bridge fee in wei
     */
    function updateBridgeFee(uint256 _newFee) external onlyOwner {
        bridgeFee = _newFee;
        emit BridgeFeeUpdated(_newFee);
    }

    /**
     * @dev Update bridge status (owner only)
     * @param _active The new bridge status
     */
    function updateBridgeStatus(bool _active) external onlyOwner {
        bridgeActive = _active;
        emit BridgeStatusUpdated(_active);
    }

    /**
     * @dev Withdraw collected fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        payable(owner).transfer(balance);
        emit FeesWithdrawn(owner, balance);
    }

    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner).transfer(balance);
            emit FeesWithdrawn(owner, balance);
        }
    }

    /**
     * @dev Transfer ownership (owner only)
     * @param newOwner The new owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }

    /**
     * @dev Get contract ETH balance
     * @return The contract's ETH balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Allow contract to receive ETH
    receive() external payable {}
}
