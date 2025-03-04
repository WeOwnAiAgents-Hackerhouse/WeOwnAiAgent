import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PortfolioService } from '@myira/portfolio-service';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// API keys
const apiKeys = {
  coinGecko: process.env.COINGECKO_API_KEY,
  debank: process.env.DEBANK_API_KEY,
  zapper: process.env.ZAPPER_API_KEY,
  covalent: process.env.COVALENT_API_KEY,
};

// Create portfolio service
const portfolioService = new PortfolioService(apiKeys);

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Get user portfolio
app.get('/api/portfolio/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const chains = req.query.chains ? 
      (req.query.chains as string).split(',') as any[] : 
      undefined;
    
    const portfolio = await portfolioService.getUserPortfolio(address, chains);
    res.status(200).json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ 
      error: 'Failed to fetch portfolio data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get chain portfolio
app.get('/api/portfolio/:address/:chain', async (req, res) => {
  try {
    const { address, chain } = req.params;
    
    const portfolio = await portfolioService.getChainPortfolio(address, chain as any);
    res.status(200).json(portfolio);
  } catch (error) {
    console.error(`Error fetching portfolio for chain ${req.params.chain}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch chain portfolio data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 