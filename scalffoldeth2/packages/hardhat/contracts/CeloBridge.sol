// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MockUSDC.sol";

/**
 * @title CeloBridge
 * @dev Manages cross-chain carbon offset transactions to Celo network
 * This contract handles USDC deposits and initiates bridging to Celo for carbon projects
 */
contract CeloBridge is Ownable {
    MockUSDC public usdcToken;

    // Celo network configuration
    address public celoRecipient; // Celo address that receives funds for carbon projects
    uint256 public bridgeFee; // Fee for bridging (in basis points, e.g., 100 = 1%)

    // Transaction tracking
    struct BridgeTransaction {
        address user;
        uint256 amount;
        uint256 bridgeFee;
        uint256 netAmount;
        uint256 timestamp;
        string purpose;
        BridgeStatus status;
        string celoTxHash; // Celo transaction hash (set by oracle/backend)
    }

    enum BridgeStatus {
        PENDING,
        BRIDGED,
        COMPLETED,
        FAILED
    }

    // Events
    event BridgeInitiated(
        uint256 indexed transactionId,
        address indexed user,
        uint256 amount,
        uint256 netAmount,
        string purpose
    );

    event BridgeCompleted(uint256 indexed transactionId, string celoTxHash);

    event BridgeStatusUpdated(uint256 indexed transactionId, BridgeStatus status);

    // Storage
    mapping(uint256 => BridgeTransaction) public bridgeTransactions;
    mapping(address => uint256[]) public userTransactions;
    uint256 private _transactionIds;
    uint256 public totalBridged;

    // Reentrancy guard
    bool private _reentrancyGuard;

    modifier nonReentrant() {
        require(!_reentrancyGuard, "ReentrancyGuard: reentrant call");
        _reentrancyGuard = true;
        _;
        _reentrancyGuard = false;
    }

    constructor(address _usdcToken, address _celoRecipient, uint256 _bridgeFee) Ownable(msg.sender) {
        usdcToken = MockUSDC(_usdcToken);
        celoRecipient = _celoRecipient;
        bridgeFee = _bridgeFee; // e.g., 50 = 0.5%
    }

    /**
     * @dev Initiate a bridge transaction to Celo network
     * @param amount USDC amount to bridge
     * @param purpose Purpose of the carbon offset
     */
    function initiateBridge(uint256 amount, string memory purpose) external nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(purpose).length > 0, "Purpose required");

        // Calculate bridge fee and net amount
        uint256 feeAmount = (amount * bridgeFee) / 10000;
        uint256 netAmount = amount - feeAmount;

        // Transfer USDC from user to this contract
        bool success = usdcToken.transferFrom(msg.sender, address(this), amount);
        require(success, "USDC transfer failed");

        // Create bridge transaction record
        _transactionIds++;
        uint256 transactionId = _transactionIds;

        bridgeTransactions[transactionId] = BridgeTransaction({
            user: msg.sender,
            amount: amount,
            bridgeFee: feeAmount,
            netAmount: netAmount,
            timestamp: block.timestamp,
            purpose: purpose,
            status: BridgeStatus.PENDING,
            celoTxHash: ""
        });

        userTransactions[msg.sender].push(transactionId);
        totalBridged += netAmount;

        emit BridgeInitiated(transactionId, msg.sender, amount, netAmount, purpose);

        // In a real implementation, here you would:
        // 1. Lock the USDC tokens
        // 2. Emit an event that a bridge oracle/relayer would listen to
        // 3. The oracle would then mint equivalent tokens on Celo
        // For this demo, we'll simulate immediate bridging
        _simulateBridge(transactionId);

        return transactionId;
    }

    /**
     * @dev Simulate bridge completion (in production, this would be called by oracle)
     */
    function _simulateBridge(uint256 transactionId) private {
        bridgeTransactions[transactionId].status = BridgeStatus.BRIDGED;

        // Simulate Celo transaction hash
        string memory simulatedCeloTx = string(
            abi.encodePacked("0xcelo", _uint2str(transactionId), _uint2str(block.timestamp))
        );

        bridgeTransactions[transactionId].celoTxHash = simulatedCeloTx;

        emit BridgeCompleted(transactionId, simulatedCeloTx);
        emit BridgeStatusUpdated(transactionId, BridgeStatus.BRIDGED);
    }

    /**
     * @dev Update bridge transaction status (called by oracle in production)
     */
    function updateBridgeStatus(
        uint256 transactionId,
        BridgeStatus status,
        string memory celoTxHash
    ) external onlyOwner {
        require(transactionId > 0 && transactionId <= _transactionIds, "Invalid transaction ID");

        bridgeTransactions[transactionId].status = status;
        if (bytes(celoTxHash).length > 0) {
            bridgeTransactions[transactionId].celoTxHash = celoTxHash;
        }

        emit BridgeStatusUpdated(transactionId, status);
        if (bytes(celoTxHash).length > 0) {
            emit BridgeCompleted(transactionId, celoTxHash);
        }
    }

    /**
     * @dev Get user's bridge transaction history
     */
    function getUserTransactions(address user) external view returns (uint256[] memory) {
        return userTransactions[user];
    }

    /**
     * @dev Get bridge transaction details
     */
    function getBridgeTransaction(uint256 transactionId) external view returns (BridgeTransaction memory) {
        require(transactionId > 0 && transactionId <= _transactionIds, "Invalid transaction ID");
        return bridgeTransactions[transactionId];
    }

    /**
     * @dev Get total number of bridge transactions
     */
    function getTotalTransactions() external view returns (uint256) {
        return _transactionIds;
    }

    /**
     * @dev Update bridge fee (only owner)
     */
    function updateBridgeFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%"); // Max 10%
        bridgeFee = newFee;
    }

    /**
     * @dev Update Celo recipient address (only owner)
     */
    function updateCeloRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        celoRecipient = newRecipient;
    }

    /**
     * @dev Withdraw accumulated fees (only owner)
     */
    function withdrawFees(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        bool success = usdcToken.transfer(to, amount);
        require(success, "Transfer failed");
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        bool success = usdcToken.transfer(to, amount);
        require(success, "Transfer failed");
    }

    /**
     * @dev Convert uint to string
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
