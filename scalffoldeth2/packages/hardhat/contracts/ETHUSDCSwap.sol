// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MockUSDC.sol";

/**
 * @title ETH to USDC Swap Contract
 * @dev A simple contract that allows users to swap ETH for USDC at a fixed rate
 * @notice This is for testnet demonstration purposes
 */
contract ETHUSDCSwap {
    MockUSDC public usdcToken;
    address public owner;
    uint256 public exchangeRate; // How much USDC per 1 ETH (in wei)

    event ETHSwappedForUSDC(address indexed user, uint256 ethAmount, uint256 usdcAmount);

    event ExchangeRateUpdated(uint256 newRate);
    event USDCWithdrawn(address indexed owner, uint256 amount);
    event ETHWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _usdcToken, uint256 _exchangeRate) {
        usdcToken = MockUSDC(_usdcToken);
        owner = msg.sender;
        exchangeRate = _exchangeRate; // e.g., 2000 * 10^6 for 2000 USDC per ETH
    }

    /**
     * @dev Swap ETH for USDC at the current exchange rate
     * @notice Sends ETH and receives USDC in return
     */
    function swapETHForUSDC() external payable {
        require(msg.value > 0, "Must send ETH to swap");

        // Calculate USDC amount to give
        // exchangeRate is USDC per ETH (with 6 decimals for USDC)
        uint256 usdcAmount = (msg.value * exchangeRate) / 1e18;

        // Check if contract has enough USDC
        require(usdcToken.balanceOf(address(this)) >= usdcAmount, "Insufficient USDC in contract");

        // Transfer USDC to user
        require(usdcToken.transfer(msg.sender, usdcAmount), "USDC transfer failed");

        emit ETHSwappedForUSDC(msg.sender, msg.value, usdcAmount);
    }

    /**
     * @dev Get the current exchange rate
     * @return The amount of USDC (with 6 decimals) per 1 ETH
     */
    function getExchangeRate() external view returns (uint256) {
        return exchangeRate;
    }

    /**
     * @dev Calculate how much USDC you would get for a given amount of ETH
     * @param ethAmount The amount of ETH (in wei)
     * @return The amount of USDC (with 6 decimals)
     */
    function calculateUSDCAmount(uint256 ethAmount) external view returns (uint256) {
        return (ethAmount * exchangeRate) / 1e18;
    }

    /**
     * @dev Get the contract's current USDC balance
     * @return The USDC balance of this contract
     */
    function getContractUSDCBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }

    /**
     * @dev Get the contract's current ETH balance
     * @return The ETH balance of this contract
     */
    function getContractETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Owner functions

    /**
     * @dev Update the exchange rate (owner only)
     * @param _newRate The new exchange rate (USDC per ETH with 6 decimals)
     */
    function updateExchangeRate(uint256 _newRate) external onlyOwner {
        exchangeRate = _newRate;
        emit ExchangeRateUpdated(_newRate);
    }

    /**
     * @dev Fund the contract with USDC (owner only)
     * @param amount The amount of USDC to add to the contract
     */
    function fundWithUSDC(uint256 amount) external onlyOwner {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
    }

    /**
     * @dev Withdraw USDC from the contract (owner only)
     * @param amount The amount of USDC to withdraw
     */
    function withdrawUSDC(uint256 amount) external onlyOwner {
        require(usdcToken.balanceOf(address(this)) >= amount, "Insufficient USDC balance");
        require(usdcToken.transfer(owner, amount), "USDC transfer failed");
        emit USDCWithdrawn(owner, amount);
    }

    /**
     * @dev Withdraw ETH from the contract (owner only)
     * @param amount The amount of ETH to withdraw (in wei)
     */
    function withdrawETH(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient ETH balance");
        payable(owner).transfer(amount);
        emit ETHWithdrawn(owner, amount);
    }

    /**
     * @dev Emergency withdraw all ETH (owner only)
     */
    function emergencyWithdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner).transfer(balance);
            emit ETHWithdrawn(owner, balance);
        }
    }

    /**
     * @dev Emergency withdraw all USDC (owner only)
     */
    function emergencyWithdrawUSDC() external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        if (balance > 0) {
            require(usdcToken.transfer(owner, balance), "USDC transfer failed");
            emit USDCWithdrawn(owner, balance);
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

    // Allow contract to receive ETH
    receive() external payable {}
}
