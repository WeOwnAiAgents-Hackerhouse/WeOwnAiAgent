# MyIRA - Your Intelligent Retirement Assistant

MyIRA is a decentralized retirement planning platform that helps users manage their crypto assets across multiple chains for long-term growth and retirement planning.

## Features

- **Multi-Chain Portfolio Tracking**: View your assets across Ethereum, Optimism, Base, and more
- **AI-Powered Insights**: Get personalized recommendations based on your portfolio
- **Retirement Planning**: Set goals and track progress with advanced planning tools
- **Interactive Chat Interface**: Communicate with an AI assistant to manage your portfolio

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Web3**: Wagmi, Ethers.js, Viem
- **AI**: OpenAI API, Vercel AI SDK
- **Data Visualization**: Recharts
- **Package Management**: pnpm

## Project Structure

This is a monorepo using Turborepo with the following structure:

- `apps/`
  - `web/` - Next.js web application
  - `api/` - API services
- `packages/`
  - `ui/` - Shared UI components
  - `utils/` - Utility functions
  - `hooks/` - React hooks
  - `providers/` - Context providers
  - `portfolio-service/` - Portfolio management services

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/myira.git
   cd myira
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp apps/web/.env.local.example apps/web/.env.local
   ```
   Then edit the `.env.local` file to add your OpenAI API key.

4. Run the development server
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Adding a new package

```bash
mkdir -p packages/new-package
cd packages/new-package
pnpm init
```

Then update the `package.json` to include the workspace reference:

```json
{
  "name": "@myira/new-package",
  "version": "0.1.0",
  "private": true
}
```

### Using a local package in another package

In the dependent package's `package.json`:

```json
{
  "dependencies": {
    "@myira/other-package": "workspace:*"
  }
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
