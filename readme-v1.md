# 🚀 WeOwn Agent Box - ETHDenver 2025 Hackathon
![Deployment Status](https://img.shields.io/badge/deployment-active-brightgreen)

## 👥 Team Members
- **Dhruv Malik** - Fullstack Development / web3 and Prompt Engineering.
- **Jason Younker (Yonks.eth)** - ideator and project manager.
- **Mike** - help in pitching and feedback 

## 📋 Project Overview
WeOwn Agent Box is a SaaS platform designed to establish robust AI agent verticals with seamless Web3 integration. Our platform empowers developers to swiftly deploy and manage AI agents that can interact with various blockchain networks and protocols.

## 🏆 Web3 Bounties Integration
| Project Name   | Bounty Description                                      | Package Location   | Integration Remarks                                                        |
|----------------|--------------------------------------------------------|--------------------|---------------------------------------------------------------------------|
| **ETHDenver**   | $15k prize pool for Infrastructure & Scalability       | `infra/`           | Deployed AWS infrastructure with RDS, S3, and Amplify for scalable agent hosting |
| **EigenLayer**  | $20k for AI agent use case with AVS integration        | `lib/eigen/`       | Adapter for AVS execution cost offsetting with custom DA infrastructure   |
| **Story Protocol** | $10k for IP-based agent for patent litigation risk   | `lib/story/`       | IP resolution agent with on-chain verification of patent status            |
| **Optimism**    | $5k for L2 agent with cross superchain deployment      | `lib/optimism/`    | Optimism-based agent with cross-chain messaging capabilities               |
| **Base**        | $5k for Agent Kit integration                           | `lib/base/`        | Integration with Basenames, OnchainKit, and Smart Wallet                 |
| **Olas**        | $8k for Olas agent using SDK                            | `lib/olas/`        | Agent registration to wallet using Olas SDK                               |

## 🛠️ Build & Deployment Guide

### Prerequisites
- Node.js v18+
- AWS Account with appropriate permissions
- GitHub account with access to the repository
- API keys for OpenAI and Fireworks AI

### Environment Setup
1. **Clone the repository**: `WeOwnAiAgent`
2. **Set up environment variables**:
   - Create a `.env` file in the root directory based on the `.env.example` template.
   - Also create a `.env` file in the `infra/` directory.
   - Fill in the required environment variables.

3. **Install dependencies**: `npm install`

### Infrastructure Deployment
#### AWS Secrets Setup
Create the following secrets in AWS Secrets Manager:
- `github-token`: GitHub Personal Access Token with `repo` and `admin:repo_hook` permissions
- `github-private-key`: SSH private key for GitHub repository access
- `chatbot-db-credentials`: Database credentials in JSON format with username and password

#### Deploy Infrastructure Stack
- `AgentBoxInfraStack`
- Deploy Amplify Stack: `AgentBoxAmplifyStack`

### Access the Application
After successful deployment, you can access the application using the URL provided in the CloudFormation outputs.

### Local Development
- **Start the development server**: `npm run dev`
- **Run database migrations**: `npm run migrate`
- **Run tests**: `npm run test`

## 📊 Architecture Overview
Our application utilizes a modern serverless architecture:
- **Frontend**: Next.js application hosted on AWS Amplify
- **Database**: PostgreSQL on AWS RDS
- **Storage**: S3 for file storage
- **Authentication**: Custom auth with JWT tokens
- **AI Integration**: OpenAI and Fireworks AI APIs
- **Web3 Integration**: Multiple blockchain protocols via custom adapters

## 🔗 Useful Links
- [Live Demo](#)
- [GitHub Repository](#)
- [Documentation](#)

---

*Built with ❤️ for ETHDenver 2025 Hackathon*
