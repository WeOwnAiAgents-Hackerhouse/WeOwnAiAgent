# Portfolio Service

A modular service for tracking crypto portfolio assets across multiple chains.

## Features

- Track token balances across multiple chains
- Track NFT holdings with floor prices
- Track staking positions and rewards
- Aggregated portfolio view with total values
- React hooks and context for easy integration

## Installation

```bash
npm install @weown/portfolio-service
# or
yarn add @weown/portfolio-service
```

## Usage

### Basic Usage

```tsx
import { PortfolioProvider, usePortfolio } from '@weown/portfolio-service';

// In your app root
function App() {
  const apiKeys = {
    coinGecko: 'YOUR_COINGECKO_API_KEY',
    // Add other API keys as needed
  };

  return (
    <PortfolioProvider 
      apiKeys={apiKeys}
      defaultChains={['ethereum', 'optimism', 'base']}
      autoRefreshInterval={60000} // 1 minute
    >
      <YourApp />
    </PortfolioProvider>
  );
}

// In your components
function PortfolioView() {
  const { 
    portfolio, 
    isLoading, 
    error, 
    refresh,
    totalValue,
    chainValues
  } = usePortfolio({
    address: '0x123...', 
    chains: ['ethereum', 'optimism']
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!portfolio) return <div>No portfolio data</div>;

  return (
    <div>
      <h1>Portfolio Value: ${totalValue.toLocaleString()}</h1>
      
      {portfolio.chains.map(chain => (
        <div key={chain.chain}>
          <h2>{chain.chain}: ${chain.totalValue.toLocaleString()}</h2>
          
          <h3>Tokens (${chain.tokensValue.toLocaleString()})</h3>
          <ul>
            {chain.tokens.map(token => (
              <li key={token.address}>
                {token.symbol}: {token.balance} (${token.value.toLocaleString()})
              </li>
            ))}
          </ul>
          
          <h3>NFTs (${chain.nftsValue.toLocaleString()})</h3>
          <ul>
            {chain.nfts.map(nft => (
              <li key={`${nft.address}-${nft.tokenId}`}>
                {nft.name} - Floor: ${nft.floorPrice?.toLocaleString() || 'N/A'}
              </li>
            ))}
          </ul>
          
          <h3>Staking (${chain.stakingValue.toLocaleString()})</h3>
          <ul>
            {chain.stakingPositions.map((pos, i) => (
              <li key={i}>
                {pos.protocol} - {pos.asset}: {pos.amount} (${pos.value.toLocaleString()})
                <br />APR: {pos.apr}% - Rewards: {pos.rewards} (${pos.rewardsValue.toLocaleString()})
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <button onClick={() => refresh()}>Refresh Portfolio</button>
    </div>
  );
}
```

### Direct Service Usage

You can also use the services directly without the React context:

```tsx
import { 
  PortfolioService, 
  TokenService, 
  NFTService, 
  StakingService 
} from '@weown/portfolio-service';

async function fetchPortfolio(address: string) {
  const apiKeys = {
    coinGecko: 'YOUR_COINGECKO_API_KEY',
    // Add other API keys as needed
  };
  
  // Create service instances
  const portfolioService = new PortfolioService(apiKeys);
  
  // Fetch portfolio data
  const portfolio = await portfolioService.getUserPortfolio(
    address, 
    ['ethereum', 'optimism', 'base']
  );
  
  console.log('Portfolio:', portfolio);
  
  // Or use individual services
  const tokenService = new TokenService(apiKeys);
  const tokens = await tokenService.getTokenBalances(address, 'ethereum');
  console.log('Ethereum tokens:', tokens);
}
```

## Architecture

The portfolio service follows the Single Responsibility Principle with separate services for different asset types:

- `TokenService`: Manages token balances and prices
- `NFTService`: Manages NFT holdings and floor prices
- `StakingService`: Manages staking positions and rewards
- `PortfolioService`: Aggregates data from the other services

## API Reference

### Services

#### PortfolioService

- `getUserPortfolio(address: string, chains?: SupportedChain[]): Promise<UserPortfolio>`
- `getChainPortfolio(address: string, chain: SupportedChain): Promise<ChainPortfolio>`

#### TokenService

- `getTokenBalances(address: string, chain: SupportedChain): Promise<TokenBalance[]>`
- `updateTokenPrices(tokens: TokenBalance[]): Promise<TokenBalance[]>`

#### NFTService

- `getNFTs(address: string, chain: SupportedChain): Promise<NFTItem[]>`

#### StakingService

- `getStakingPositions(address: string, chain: SupportedChain): Promise<StakingPosition[]>`

### React Hooks

#### usePortfolio

```tsx
const {
  portfolio,
  isLoading,
  error,
  refresh,
  getChainPortfolio,
  totalValue,
  chainValues
} = usePortfolio({
  address: string,
  chains: SupportedChain[],
  autoFetch: boolean
});
```

## License

MIT 