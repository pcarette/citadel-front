import { Address } from 'viem';
import { CONTRACT_ADDRESSES } from './contracts';

// Citadel Multi LP Liquidity Pool ABI
export const CITADEL_MULTI_LP_POOL_ABI = [
  // View functions for getting trade info
  {
    inputs: [{ name: '_collateralAmount', type: 'uint256' }],
    name: 'getMintTradeInfo',
    outputs: [
      { name: 'synthTokensReceived', type: 'uint256' },
      { name: 'feePaid', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_syntTokensAmount', type: 'uint256' }],
    name: 'getRedeemTradeInfo',
    outputs: [
      { name: 'collateralAmountReceived', type: 'uint256' },
      { name: 'feePaid', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // Core trading functions
  {
    inputs: [
      {
        components: [
          { name: 'minNumTokens', type: 'uint256' },
          { name: 'collateralAmount', type: 'uint256' },
          { name: 'expiration', type: 'uint256' },
          { name: 'recipient', type: 'address' }
        ],
        name: 'mintParams',
        type: 'tuple'
      }
    ],
    name: 'mint',
    outputs: [
      { name: 'syntheticTokensMinted', type: 'uint256' },
      { name: 'feePaid', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'numTokens', type: 'uint256' },
          { name: 'minCollateral', type: 'uint256' },
          { name: 'expiration', type: 'uint256' },
          { name: 'recipient', type: 'address' }
        ],
        name: 'redeemParams',
        type: 'tuple'
      }
    ],
    name: 'redeem',
    outputs: [
      { name: 'collateralRedeemed', type: 'uint256' },
      { name: 'feePaid', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Pool info functions
  {
    inputs: [],
    name: 'feePercentage',
    outputs: [{ name: 'fee', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collateralAsset',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'syntheticAsset',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSyntheticTokens',
    outputs: [{ name: 'totalTokens', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalCollateralAmount',
    outputs: [
      { name: 'usersCollateral', type: 'uint256' },
      { name: 'lpsCollateral', type: 'uint256' },
      { name: 'totalCollateral', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// ERC20 ABI for token interactions
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const;

// Citadel Pool configuration
export interface CitadelPool {
  address: Address;
  collateralToken: Address;
  syntheticToken: Address;
  name: string;
  symbol: string;
  collateralSymbol: string;
}

// Citadel pools using actual deployed addresses
export const CITADEL_POOLS: CitadelPool[] = [
  {
    address: CONTRACT_ADDRESSES.pool,
    collateralToken: CONTRACT_ADDRESSES.collateral, // FDUSD testnet
    syntheticToken: '0x0B5e46027B856E6109E9817C37ddaB1796331E56' as Address, // Citadel EUR token
    name: 'Citadel EUR Pool',
    symbol: 'cEUR',
    collateralSymbol: 'FDUSD',
  },
  {
    address: '0x0000000000000000000000000000000000000003' as Address, // Update with actual pool address
    collateralToken: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' as Address, // USDC
    syntheticToken: '0x0000000000000000000000000000000000000004' as Address, // Update with synth token
    name: 'Citadel USD Pool',
    symbol: 'cUSD',
    collateralSymbol: 'USDC',
  },
  {
    address: '0x0000000000000000000000000000000000000005' as Address, // Update with actual pool address
    collateralToken: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3' as Address, // DAI
    syntheticToken: '0x0000000000000000000000000000000000000006' as Address, // Update with synth token
    name: 'Citadel Gold Pool',
    symbol: 'cGOLD',
    collateralSymbol: 'DAI',
  },
];

// Helper function to find pool by tokens
export function findCitadelPoolByTokens(tokenA: Address, tokenB: Address): CitadelPool | undefined {
  return CITADEL_POOLS.find(pool => 
    (pool.collateralToken === tokenA && pool.syntheticToken === tokenB) ||
    (pool.collateralToken === tokenB && pool.syntheticToken === tokenA)
  );
}

// Helper to check if it's a mint operation (collateral -> synthetic)
export function isMintOperation(fromToken: Address, toToken: Address, pool: CitadelPool): boolean {
  return fromToken === pool.collateralToken && toToken === pool.syntheticToken;
}

// Helper to check if it's a redeem operation (synthetic -> collateral)
export function isRedeemOperation(fromToken: Address, toToken: Address, pool: CitadelPool): boolean {
  return fromToken === pool.syntheticToken && toToken === pool.collateralToken;
}