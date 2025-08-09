const contractAddress = "0x9B0B2CcB86400f2c9c30478c1ae7dC863dA78195";
const contractABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_usdcToken",
          type: "address",
        },
        {
          internalType: "address",
          name: "_klimadao",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "donor",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "co2Offset",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      name: "DonationReceived",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "donations",
      outputs: [
        {
          internalType: "address",
          name: "donor",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "co2Offset",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "donationId",
          type: "uint256",
        },
      ],
      name: "getDonation",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "donor",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "co2Offset",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "message",
              type: "string",
            },
          ],
          internalType: "struct EcoQuestDonation.Donation",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getTotalDonations",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getUserStats",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "totalDonated",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "totalCO2Offset",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "donationCount",
              type: "uint256",
            },
          ],
          internalType: "struct EcoQuestDonation.UserStats",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "klimadao",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "co2Offset",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      name: "offset",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "totalCO2Offset",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalDonations",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "usdcToken",
      outputs: [
        {
          internalType: "contract MockUSDC",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "userStats",
      outputs: [
        {
          internalType: "uint256",
          name: "totalDonated",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalCO2Offset",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "donationCount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    window.web3 = new Web3(window.ethereum);
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
  } else {
    alert("MetaMask not found");
    throw new Error("MetaMask not found");
  }
}

function onQuestComplete(playerId, questId) {
    // This function runs as soon as quest completes
    mintNFTForPlayer(playerId, questId);
  }
  

  async function mintNFTForPlayer(playerId, questId) {
    // Optional: double-check quest status if you want:
    if (!window.myNFTService) {
      alert("NFT service not loaded");
      return;
    }
  
    // Mint NFT automatically
    const success = await window.myNFTService.checkQuestAndMint(playerId, questId);
  
    if (success) {
      console.log("NFT minted automatically!");
      // You can also update your game UI here
    } else {
      console.log("Minting failed or quest not complete.");
    }
  }
  
// Export functions if using modules (optional)
window.myNFTService = { connectWallet, mintNFT, checkQuestAndMint };
