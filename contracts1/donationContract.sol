// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MockUSDC.sol";

/* This contract is to fund rewards pool from sponsors
    and let user who hit the point's threshold to offset
    where they click offset and certain amount of usdc in the pool will be sent to Klimadao*/

/* To refine
    - the amount of usdc shld not be input by user but default (value passed by the system)*/

/// @title RewardsPool for Carbon Offsets via KlimaDAO using MockUSDC
contract RewardsPool {
    address public klimadao;
    MockUSDC public usdc;
    address public owner;

    event Sponsored(address indexed sponsor, uint256 amount);
    event OffsetTriggered(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _usdc, address _klimadao) {
        usdc = MockUSDC(_usdc);
        klimadao = _klimadao;
        owner = msg.sender;
    }

    /// @notice Sponsors fund the pool with USDC
    function sponsor(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
        emit Sponsored(msg.sender, amount);
    }

    /// @notice User triggers offset for themselves (e.g., after quest completion)
    function triggerOffset(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(usdc.transfer(klimadao, amount), "USDC transfer to KlimaDAO failed");
        emit OffsetTriggered(msg.sender, amount);
    }
}
