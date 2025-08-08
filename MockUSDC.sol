// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*Frontend tip:
    Can make the user experience smoother by:
    1. User only input donation amount once (not in both approve() and offset()
            Asking the user for the donation amount once,
            Then, in your frontend code, call approve(spender, amount) and
            offset(amount) with the same value.
    2. User nonid to input klimadao_contract address
            Hardcode or configure the KlimadaoDonation contract address in your frontend code 
            (for example, in a config file or as a constant).*/

/// @title MockUSDC - Simple ERC20 Token for Testing
contract MockUSDC {
    string public name = "Mock USDC";
    string public symbol = "mUSDC";
    uint8 public decimals = 6;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }
}

/// @title KlimadaoDonation - Donate USDC to KlimaDAO
contract KlimadaoDonation {
    address public klimadao;
    MockUSDC public usdc;

    event Offset(address indexed donor, uint256 amount);

    constructor(address _usdc, address _klimadao) {
        usdc = MockUSDC(_usdc);
        klimadao = _klimadao;
    }

    /// @notice Donate USDC to KlimaDAO
    /// @param amount Amount in USDC's smallest unit (e.g., 1000000 = 1 USDC)
    function offset(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        bool success = usdc.transferFrom(msg.sender, klimadao, amount);
        require(success, "USDC transfer failed");
        emit Offset(msg.sender, amount);
    }
}