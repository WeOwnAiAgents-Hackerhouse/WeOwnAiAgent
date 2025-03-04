import { 
  ApiKeys, 
  ChainPortfolio, 
  IPortfolioService, 
  SupportedChain, 
  UserPortfolio 
} from '../types';
import { TokenService } from './token-service';
import { NFTService } from './nft-service';
import { StakingService } from './staking-service';

export class PortfolioService implements IPortfolioService {
  private tokenService: TokenService;
  private nftService: NFTService;
  private stakingService: StakingService;
  private defaultChains: SupportedChain[] = ['ethereum', 'optimism', 'base'];
  
  constructor(apiKeys: ApiKeys) {
    this.tokenService = new TokenService(apiKeys);
    this.nftService = new NFTService(apiKeys);
    this.stakingService = new StakingService(apiKeys);
  }

  /**
   * Fetches a user's portfolio across multiple chains
   */
  async getUserPortfolio(
    address: string, 
    chains: SupportedChain[] = this.defaultChains
  ): Promise<UserPortfolio> {
    try {
      // Fetch portfolio data for each chain in parallel
      const chainPortfolios = await Promise.all(
        chains.map(chain => this.getChainPortfolio(address, chain))
      );
      
      // Calculate total portfolio value
      const totalValue = chainPortfolios.reduce(
        (sum, portfolio) => sum + portfolio.totalValue, 
        0
      );
      
      return {
        address,
        chains: chainPortfolios,
        totalValue,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching user portfolio:', error);
      throw new Error('Failed to fetch portfolio data');
    }
  }

  /**
   * Fetches a user's portfolio for a specific chain
   */
  async getChainPortfolio(
    address: string, 
    chain: SupportedChain
  ): Promise<ChainPortfolio> {
    try {
      // Fetch all data in parallel
      const [tokens, nfts, stakingPositions] = await Promise.all([
        this.tokenService.getTokenBalances(address, chain),
        this.nftService.getNFTs(address, chain),
        this.stakingService.getStakingPositions(address, chain)
      ]);
      
      // Update token prices
      const tokensWithPrices = await this.tokenService.updateTokenPrices(tokens);
      
      // Calculate total values
      const tokensValue = tokensWithPrices.reduce((sum, token) => sum + token.value, 0);
      const nftsValue = nfts.reduce((sum, nft) => sum + (nft.floorPrice || 0), 0);
      const stakingValue = stakingPositions.reduce((sum, pos) => sum + pos.value, 0);
      const totalValue = tokensValue + nftsValue + stakingValue;
      
      return {
        chain,
        tokens: tokensWithPrices,
        nfts,
        stakingPositions,
        tokensValue,
        nftsValue,
        stakingValue,
        totalValue
      };
    } catch (error) {
      console.error(`Error fetching portfolio for chain ${chain}:`, error);
      // Return empty portfolio for this chain
      return {
        chain,
        tokens: [],
        nfts: [],
        stakingPositions: [],
        tokensValue: 0,
        nftsValue: 0,
        stakingValue: 0,
        totalValue: 0
      };
    }
  }
} 