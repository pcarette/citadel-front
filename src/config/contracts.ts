import { Address } from 'viem';
import testnetAddresses from '../../testnet-addresses.json';

export interface ContractAddresses {
  chainlinkPriceFeed: Address;
  collateralWhitelist: Address;
  collateral: Address;
  compoundModule: Address;
  deployer: Address;
  factoryVersioning: Address;
  finder: Address;
  identifierWhitelist: Address;
  lendingManager: Address;
  lendingStorageManager: Address;
  manager: Address;
  pool: Address;
  poolFactory: Address;
  poolImplementation: Address;
  poolRegistry: Address;
  priceFeed: Address;
  pythAggregator: Address;
  tokenFactory: Address;
  trustedForwarder: Address;
  faucetLimiter: Address;
}

export const CONTRACT_ADDRESSES: ContractAddresses = {
  chainlinkPriceFeed: testnetAddresses.contracts.chainlinkPriceFeed.address as Address,
  collateralWhitelist: testnetAddresses.contracts.collateralWhitelist.address as Address,
  collateral: testnetAddresses.contracts.collateral.address as Address,
  compoundModule: testnetAddresses.contracts.compoundModule.address as Address,
  deployer: testnetAddresses.contracts.deployer.address as Address,
  factoryVersioning: testnetAddresses.contracts.factoryVersioning.address as Address,
  finder: testnetAddresses.contracts.finder.address as Address,
  identifierWhitelist: testnetAddresses.contracts.identifierWhitelist.address as Address,
  lendingManager: testnetAddresses.contracts.lendingManager.address as Address,
  lendingStorageManager: testnetAddresses.contracts.lendingStorageManager.address as Address,
  manager: testnetAddresses.contracts.manager.address as Address,
  pool: testnetAddresses.contracts.pool.address as Address,
  poolFactory: testnetAddresses.contracts.poolFactory.address as Address,
  poolImplementation: testnetAddresses.contracts.poolImplementation.address as Address,
  poolRegistry: testnetAddresses.contracts.poolRegistry.address as Address,
  priceFeed: testnetAddresses.contracts.priceFeed.address as Address,
  pythAggregator: testnetAddresses.contracts.pythAggregator.address as Address,
  tokenFactory: testnetAddresses.contracts.tokenFactory.address as Address,
  trustedForwarder: testnetAddresses.contracts.trustedForwarder.address as Address,
  faucetLimiter: testnetAddresses.contracts.faucetLimiter.address as Address,
};

export const NETWORK_INFO = {
  network: testnetAddresses.network,
  chainId: testnetAddresses.chainId,
  deployedAt: testnetAddresses.deployedAt,
};