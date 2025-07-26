# Claude Context: LPInfo Struct Integration

## Frontend Architecture for LPInfo Data Structure

I built a React TypeScript frontend that maps directly to your Solidity `LPInfo` struct. Here's how the data flows from contract to UI:

## 1. TypeScript Interface Mapping

```typescript
// /src/components/pools-module.tsx
export interface LPInfo {
  actualCollateralAmount: number    // uint256 actualCollateralAmount
  tokensCollateralized: number      // uint256 tokensCollateralized  
  overCollateralization: number     // uint256 overCollateralization
  capacity: number                  // uint256 capacity
  utilization: number               // uint256 utilization
  coverage: number                  // uint256 coverage
  mintShares: number                // uint256 mintShares
  redeemShares: number              // uint256 redeemShares
  interestShares: number            // uint256 interestShares
  isOvercollateralized: boolean     // bool isOvercollateralized
}
```

## 2. Data Integration Points

### Pool/Vault Entity
```typescript
export interface PoolVault {
  // ... other fields
  userPosition?: {
    amount: number
    value: number
    lpInfo: LPInfo          // User-specific LP data
  }
  lpInfo: LPInfo            // Pool-wide LP data
  // ... other fields
}
```

## 3. UI Component Mapping

### User Positions Display (`user-positions.tsx`)
```typescript
// Direct struct field usage in UI:
<div className="bg-white/5 rounded-xl p-3">
  <div className="text-sm text-white/60 mb-1">Collateral</div>
  <div className="text-lg font-semibold text-white">
    ${pool.userPosition?.lpInfo.actualCollateralAmount.toLocaleString()}
  </div>
</div>

<div className="bg-white/5 rounded-xl p-3">
  <div className="text-sm text-white/60 mb-1">Utilization</div>
  <div className="text-lg font-semibold text-white">
    {pool.userPosition?.lpInfo.utilization}%
  </div>
</div>

<div className="bg-white/5 rounded-xl p-3">
  <div className="text-sm text-white/60 mb-1">Coverage</div>
  <div className="text-lg font-semibold text-white">
    {pool.userPosition?.lpInfo.coverage}%
  </div>
</div>

<div className="bg-white/5 rounded-xl p-3">
  <div className="text-sm text-white/60 mb-1">Capacity</div>
  <div className="text-lg font-semibold text-white">
    ${pool.userPosition?.lpInfo.capacity.toLocaleString()}
  </div>
</div>
```

### Pool Details Modal (`pool-details-modal.tsx`)
```typescript
// Comprehensive LPInfo display with all struct fields:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Actual Collateral */}
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="text-sm text-white/60 mb-2">Actual Collateral</div>
    <div className="text-xl font-bold text-white mb-1">
      ${lpInfo.actualCollateralAmount.toLocaleString()}
    </div>
    <div className="text-sm text-white/60">
      {lpInfo.tokensCollateralized.toLocaleString()} tokens
    </div>
  </div>

  {/* Overcollateralization */}
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="text-sm text-white/60 mb-2">Overcollateralization</div>
    <div className="text-xl font-bold text-white mb-1">
      {lpInfo.overCollateralization}%
    </div>
    <div className={`text-sm ${lpInfo.isOvercollateralized ? "text-green-400" : "text-red-400"}`}>
      {lpInfo.isOvercollateralized ? "Healthy" : "At Risk"}
    </div>
  </div>

  {/* Capacity */}
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="text-sm text-white/60 mb-2">LP Capacity</div>
    <div className="text-xl font-bold text-white">
      ${lpInfo.capacity.toLocaleString()}
    </div>
  </div>

  {/* Utilization with Progress Bar */}
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="text-sm text-white/60 mb-2">Utilization Ratio</div>
    <div className="text-xl font-bold text-white mb-2">{lpInfo.utilization}%</div>
    <div className="w-full bg-white/10 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
        style={{ width: `${lpInfo.utilization}%` }}
      />
    </div>
  </div>

  {/* Coverage with Progress Bar */}
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="text-sm text-white/60 mb-2">Collateral Coverage</div>
    <div className="text-xl font-bold text-white mb-2">{lpInfo.coverage}%</div>
    <div className="w-full bg-white/10 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
        style={{ width: `${Math.min(lpInfo.coverage, 100)}%` }}
      />
    </div>
  </div>

  {/* Shares Distribution */}
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="text-sm text-white/60 mb-2">Shares Distribution</div>
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-white/80">Mint</span>
        <span className="text-white">{lpInfo.mintShares}%</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-white/80">Redeem</span>
        <span className="text-white">{lpInfo.redeemShares}%</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-white/80">Interest</span>
        <span className="text-white">{lpInfo.interestShares}%</span>
      </div>
    </div>
  </div>
</div>
```

## 4. Data Flow Pattern

```
Contract LPInfo Struct → Web3 Hook → React Component → UI Display

1. Contract returns LPInfo struct
2. Hook processes uint256 values (likely needs formatUnits conversion)
3. Component receives typed LPInfo object
4. UI renders each field with appropriate formatting
```

## 5. Expected Web3 Integration

```typescript
// Hook example for fetching LPInfo
const { data: lpInfo } = useReadContract({
  address: poolAddress,
  abi: poolAbi,
  functionName: 'getLPInfo',
  args: [userAddress]
})

// Convert BigInt values to numbers for UI
const processedLPInfo: LPInfo = {
  actualCollateralAmount: Number(formatUnits(lpInfo.actualCollateralAmount, 18)),
  tokensCollateralized: Number(formatUnits(lpInfo.tokensCollateralized, 18)),
  overCollateralization: Number(lpInfo.overCollateralization),
  capacity: Number(formatUnits(lpInfo.capacity, 18)),
  utilization: Number(lpInfo.utilization),
  coverage: Number(lpInfo.coverage),
  mintShares: Number(lpInfo.mintShares),
  redeemShares: Number(lpInfo.redeemShares),
  interestShares: Number(lpInfo.interestShares),
  isOvercollateralized: lpInfo.isOvercollateralized
}
```

## 6. Key Design Decisions

- **Direct Field Mapping**: TypeScript interface exactly matches Solidity struct
- **Flexible Display**: Same data used for both pool-wide and user-specific views
- **Visual Indicators**: Progress bars for utilization/coverage, color coding for risk status
- **Comprehensive Coverage**: All 10 struct fields displayed in appropriate UI contexts
- **Responsive Layout**: Grid system adapts to different screen sizes

The frontend is structured to directly consume your `LPInfo` struct with minimal data transformation, making integration straightforward when you connect real contract data.