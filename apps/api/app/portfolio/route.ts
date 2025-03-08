import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PortfolioService } from '@myira/portfolio-service';

// Input validation schema
const portfolioRequestSchema = z.object({
  address: z.string().min(42).max(42),
  chains: z.array(z.enum(['ethereum', 'optimism', 'base', 'arbitrum', 'polygon'])).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate input
    const result = portfolioRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { address, chains = ['ethereum', 'optimism', 'base'] } = result.data;
    
    // Initialize portfolio service
    const portfolioService = new PortfolioService({
      apiKeys: {
        coinGecko: process.env.COINGECKO_API_KEY,
        debank: process.env.DEBANK_API_KEY,
        zapper: process.env.ZAPPER_API_KEY,
        covalent: process.env.COVALENT_API_KEY,
      }
    });
    
    // Fetch portfolio data
    const portfolio = await portfolioService.getUserPortfolio(address, chains);
    
    // Return response
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  const chainsParam = req.nextUrl.searchParams.get('chains');
  
  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }
  
  // Parse chains parameter
  let chains: string[] = ['ethereum', 'optimism', 'base'];
  if (chainsParam) {
    chains = chainsParam.split(',');
  }
  
  try {
    // Initialize portfolio service
    const portfolioService = new PortfolioService({
      apiKeys: {
        coinGecko: process.env.COINGECKO_API_KEY,
        debank: process.env.DEBANK_API_KEY,
        zapper: process.env.ZAPPER_API_KEY,
        covalent: process.env.COVALENT_API_KEY,
      }
    });
    
    // Fetch portfolio data
    const portfolio = await portfolioService.getUserPortfolio(address, chains as any);
    
    // Return response
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data', message: (error as Error).message },
      { status: 500 }
    );
  }
} 