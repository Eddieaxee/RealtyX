/**
 * RealtyX Blockchain Interaction Utility
 *
 * This module provides server-side interactions with the RealtyXAssetManager
 * ERC-1155 smart contract using viem (for the Next.js API server).
 *
 * Key operations:
 * - setKYCStatus: Called when admin approves/rejects KYC in the portal
 * - mintPropertyFractions: Called when a new property is listed
 * - safeTransferFrom: For transferring tokens on behalf of users
 */

// ERC-1155 ABI fragments for the RealtyXAssetManager contract
export const REALTYX_ASSET_MANAGER_ABI = [
  // KYC
  {
    name: "setKYCStatus",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "status", type: "bool" },
    ],
    outputs: [],
  },
  {
    name: "batchSetKYCStatus",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "users", type: "address[]" },
      { name: "statuses", type: "bool[]" },
    ],
    outputs: [],
  },
  {
    name: "isKYCVerified",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  // Minting
  {
    name: "mintPropertyFractions",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "propertyId", type: "uint256" },
      { name: "supply", type: "uint256" },
      { name: "data", type: "bytes" },
      { name: "propertyURI", type: "string" },
    ],
    outputs: [],
  },
  // ERC-1155 transfers
  {
    name: "safeTransferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "id", type: "uint256" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Events
  {
    name: "KYCStatusUpdated",
    type: "event",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "status", type: "bool", indexed: false },
    ],
  },
  {
    name: "PropertyFractionsMinted",
    type: "event",
    inputs: [
      { name: "propertyId", type: "uint256", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "supply", type: "uint256", indexed: false },
    ],
  },
] as const;

/**
 * Get the contract configuration from environment variables
 */
export function getContractConfig() {
  return {
    contractAddress: (process.env.NEXT_PUBLIC_REALTYX_PLATFORM_ADDRESS ||
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
      "0x0000000000000000000000000000000000000000") as `0x${string}`,
    adminPrivateKey: process.env.ADMIN_WALLET_PRIVATE_KEY || "",
    adminAddress: (process.env.ADMIN_WALLET_ADDRESS ||
      "0x0000000000000000000000000000000000000000") as `0x${string}`,
    rpcUrl:
      process.env.NEXT_PUBLIC_RPC_URL ||
      "https://polygon-mainnet.infura.io/v3/demo",
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "137"), // Polygon mainnet default
  };
}

/**
 * Set KYC status for a user on-chain via admin wallet
 * Called when admin approves or rejects KYC in the portal
 */
export async function setKYCStatusOnChain(
  userAddress: `0x${string}`,
  status: boolean,
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const config = getContractConfig();

    if (!config.adminPrivateKey) {
      // In development, simulate the transaction
      console.log(
        `[DEV] Simulating setKYCStatus(${userAddress}, ${status}) on contract ${config.contractAddress}`,
      );
      return {
        success: true,
        txHash: `0xdev_kyc_${Date.now()}`,
      };
    }

    // Dynamic import of viem for server-side usage
    const { createWalletClient, http } = await import("viem");
    const { polygon, polygonMumbai } = await import("viem/chains");
    const { privateKeyToAccount } = await import("viem/accounts");

    const chain = config.chainId === 137 ? polygon : polygonMumbai;

    const account = privateKeyToAccount(
      config.adminPrivateKey as `0x${string}`,
    );
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(config.rpcUrl),
    });

    const txHash = await walletClient.writeContract({
      address: config.contractAddress,
      abi: [
        {
          name: "setKYCStatus",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [
            { name: "user", type: "address" },
            { name: "status", type: "bool" },
          ],
          outputs: [],
        },
      ],
      functionName: "setKYCStatus",
      args: [userAddress, status],
    });

    return { success: true, txHash };
  } catch (error) {
    console.error("Failed to set KYC status on chain:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Mint property fractions on-chain when a new property is listed
 */
export async function mintPropertyFractionsOnChain(
  recipientAddress: `0x${string}`,
  propertyId: number,
  supply: number,
  propertyURI: string,
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const config = getContractConfig();

    if (!config.adminPrivateKey) {
      console.log(
        `[DEV] Simulating mintPropertyFractions(${recipientAddress}, ${propertyId}, ${supply})`,
      );
      return {
        success: true,
        txHash: `0xdev_mint_${Date.now()}`,
      };
    }

    const { createWalletClient, http } = await import("viem");
    const { polygon, polygonMumbai } = await import("viem/chains");
    const { privateKeyToAccount } = await import("viem/accounts");

    const chain = config.chainId === 137 ? polygon : polygonMumbai;
    const account = privateKeyToAccount(
      config.adminPrivateKey as `0x${string}`,
    );
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(config.rpcUrl),
    });

    const txHash = await walletClient.writeContract({
      address: config.contractAddress,
      abi: [
        {
          name: "mintPropertyFractions",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [
            { name: "to", type: "address" },
            { name: "propertyId", type: "uint256" },
            { name: "supply", type: "uint256" },
            { name: "data", type: "bytes" },
            { name: "propertyURI", type: "string" },
          ],
          outputs: [],
        },
      ],
      functionName: "mintPropertyFractions",
      args: [
        recipientAddress,
        BigInt(propertyId),
        BigInt(supply),
        "0x",
        propertyURI,
      ],
    });

    return { success: true, txHash };
  } catch (error) {
    console.error("Failed to mint fractions on chain:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Transfer tokens from admin to user (for initial distribution)
 */
export async function transferTokensOnChain(
  fromAddress: `0x${string}`,
  toAddress: `0x${string}`,
  propertyId: number,
  amount: number,
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const config = getContractConfig();

    if (!config.adminPrivateKey) {
      console.log(`[DEV] Simulating transfer: ${fromAddress} -> ${toAddress}`);
      return {
        success: true,
        txHash: `0xdev_transfer_${Date.now()}`,
      };
    }

    const { createWalletClient, http } = await import("viem");
    const { polygon, polygonMumbai } = await import("viem/chains");
    const { privateKeyToAccount } = await import("viem/accounts");

    const chain = config.chainId === 137 ? polygon : polygonMumbai;
    const account = privateKeyToAccount(
      config.adminPrivateKey as `0x${string}`,
    );
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(config.rpcUrl),
    });

    const txHash = await walletClient.writeContract({
      address: config.contractAddress,
      abi: [
        {
          name: "safeTransferFrom",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "id", type: "uint256" },
            { name: "value", type: "uint256" },
            { name: "data", type: "bytes" },
          ],
          outputs: [],
        },
      ],
      functionName: "safeTransferFrom",
      args: [fromAddress, toAddress, BigInt(propertyId), BigInt(amount), "0x"],
    });

    return { success: true, txHash };
  } catch (error) {
    console.error("Failed to transfer tokens on chain:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
