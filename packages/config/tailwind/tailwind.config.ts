# WeOwn Agent Box

A monorepo for the WeOwn Agent Box platform, which leverages blockchain technology to provide secure, personalized financial guidance through AI-powered agents.

## Repository Structure

- `apps/` - Applications
  - `web/` - Main web application
  - `api/` - API server for bounty integrations

- `packages/` - Shared packages and bounty implementations
  - `config/` - Shared configuration
  - `database/` - Database access and models
  - `system-design/` - Shared UI components
  - `wallet-provider/` - Web3 wallet providers
  - `okto-integration/` - Okto smart wallet integration

- `infra/` - Infrastructure as code

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

### Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages and applications
- `pnpm lint` - Run linting
- `pnpm test` - Run tests

## Bounty Integrations

This project integrates with various blockchain protocols and services:

- EigenLayer - Agent restaking infrastructure
- Okto - Smart wallets and chain abstraction
- Story Protocol - IP-based agent for patent litigation risk
- Olas - Agent development framework
- Hugging Face - Model fetching and fine-tuning

## License

MIT