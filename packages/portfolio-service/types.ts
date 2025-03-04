export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
  price: number;
  value: number;
  logoUrl?: string;
}

export interface NFTItem {
  tokenId: string;
  name: string;
  collection: string;
  address: string;
  imageUrl?: string;
  floorPrice?: number;
}

export interface StakingPosition {
  protocol: string;
  asset: string;
  amount: string;
  value: number;
  apr: number;
  rewards: string;
  rewardsValue: number;
}

export interface ChainPortfolio {
  chain: SupportedChain;
  tokens: TokenBalance[];
  nfts: NFTItem[];
  stakingPositions: StakingPosition[];
  tokensValue: number;
  nftsValue: number;
  stakingValue: number;
  totalValue: number;
}

export interface UserPortfolio {
  address: string;
  chains: ChainPortfolio[];
  totalValue: number;
  lastUpdated: string;
}

export interface ApiKeys {
  coinGecko?: string;
  debank?: string;
  zapper?: string;
  covalent?: string;
}

export interface PortfolioServiceConfig {
  apiKeys: ApiKeys;
}

export interface ITokenService {
  getTokenBalances(address: string, chain: SupportedChain): Promise<TokenBalance[]>;
  updateTokenPrices(tokens: TokenBalance[]): Promise<TokenBalance[]>;
}

export interface INFTService {
  getNFTs(address: string, chain: SupportedChain): Promise<NFTItem[]>;
}

export interface IStakingService {
  getStakingPositions(address: string, chain: SupportedChain): Promise<StakingPosition[]>;
}

export interface IPortfolioService {
  getUserPortfolio(address: string, chains?: SupportedChain[]): Promise<UserPortfolio>;
  getChainPortfolio(address: string, chain: SupportedChain): Promise<ChainPortfolio>;
}

export type SupportedChain = 'ethereum' | 'optimism' | 'base' | 'arbitrum' | 'polygon';

export const CHAIN_IDS: Record<SupportedChain, number> = {
  ethereum: 1,
  optimism: 10,
  base: 8453,
  arbitrum: 42161,
  polygon: 137
};

export const CHAIN_NAMES: Record<SupportedChain, string> = {
  ethereum: 'Ethereum',
  optimism: 'Optimism',
  base: 'Base',
  arbitrum: 'Arbitrum',
  polygon: 'Polygon'
}; 