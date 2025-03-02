# ETHDenver 2025 Submission: MyIRA.fund

## Describe your project

### Project Name: 
MyIRA.fund

### Tagline: 
The first AI-powered retirement planning platform that makes crypto IRAs simple, secure, and tax-efficient.

## The problem it solves
MyIRA.fund addresses the critical gap between traditional retirement planning and the growing crypto economy. Today's investors face numerous challenges:

- **Complexity of Crypto IRA Setup:** Setting up a Self-Directed IRA (SDIRA) for cryptocurrency investments requires navigating a maze of custodians, exchanges, and regulations.
- **Fragmented Financial Knowledge:** Most financial advisors lack expertise in both retirement planning and crypto assets, leaving investors without comprehensive guidance.
- **High Fees and Friction:** Current crypto IRA solutions charge excessive fees and involve complex multi-step processes that deter adoption.
- **Security Concerns:** Traditional finance solutions don't leverage the security benefits of blockchain technology.

MyIRA.fund provides a seamless, AI-guided platform that simplifies every step of crypto retirement planning, from selecting custodians to optimizing tax strategies, all while ensuring regulatory compliance.

## User Interaction and Data Flow
1. **Initial Assessment:** Users connect with the MyIRA agent through our intuitive interface, providing their retirement goals, risk tolerance, and existing financial situation.
2. **Agent Configuration:** The platform assembles a personalized retirement agent by selecting specialized components from the Olas registry, tailored to the user's specific needs.
3. **Strategy Development:** Using the configured agent, users receive personalized recommendations for crypto IRA setup, including custodian selection, asset allocation, and tax optimization.
4. **Account Setup:** The agent guides users step-by-step through the IRA account creation process, integrating with custodians and handling necessary documentation.
5. **Ongoing Management:** After setup, users maintain an interactive dialogue with their agent for portfolio monitoring, rebalancing suggestions, and educational content.
6. **Execution and Feedback:** At each stage, users can execute recommended actions and provide feedback, which improves future recommendations through continuous learning.

The platform uses secure wallet authentication (SIWE) and maintains encrypted communication channels to protect sensitive financial information throughout this process.

## The project architecture and development process
MyIRA.fund is built on a modern, secure architecture that combines cutting-edge AI capabilities with blockchain technology:

### Frontend:
- Next.js application with Shadcn UI components for a responsive, accessible interface
- Wagmi/Viem integration for wallet connection and blockchain interactions
- Real-time streaming of AI agent responses for interactive experience

### Backend:
- FastAPI microservices for agent configuration, execution, and staking
- Integration with Olas Protocol for agent component selection and execution
- Secure authentication system supporting both traditional email/password and wallet-based authentication (SIWE)

### AI Engine:
- Custom Python implementation for agent orchestration and execution
- Component selection from the Olas registry
- Streaming response generation with proper context management

### Web3 Integration:
- ETHDenver infrastructure for scalable deployment
- EigenLayer staking mechanism to offset agent costs
- Cross-chain portfolio management via Connext
- Optimized transaction processing through Scroll
- Enhanced user experience via Base for gasless transactions

## The development process followed the Agentic SaaS workflow pattern:
- **Data Preparation:** Financial data ingestion and secure storage
- **Agent Setup:** Component selection and configuration
- **Testing/Validation:** Scenario testing for retirement plans
- **Deployment:** Secure, scalable infrastructure
- **Monitoring/Feedback:** Continuous improvement via user feedback

## Product Integrations
- **Olas Protocol:** Core integration for agent component selection, configuration, and execution. Our custom Python API client connects to Olas services for agent management and staking.
- **Sign-In With Ethereum (SIWE):** Secure wallet-based authentication that maintains user privacy while ensuring secure access.
- **IRA Custodian APIs:** Integration with cryptocurrency-friendly IRA custodians to facilitate account opening and management.
- **Cryptocurrency Exchanges:** Connections to major exchanges for portfolio construction and asset management within the IRA.
- **EigenLayer:** Implementation of the AVS (Actively Validated Service) model to offset AI operation costs through staking mechanisms.
- **Connext:** Cross-chain asset management capabilities allowing users to view and manage crypto assets across multiple blockchains within their retirement accounts.
- **Scroll:** ZK-rollup integration for efficient, low-cost transaction processing within the IRA structure.
- **Base:** Optimized user experience with gasless transaction support for common operations.

## Key differentiators and uniqueness of the project
MyIRA.fund stands apart from existing solutions through several unique innovations:

- **AI-Powered Retirement Agents:** Unlike generic crypto platforms, our solution uses specialized AI agents specifically trained on retirement planning, tax regulations, and cryptocurrency markets.
- **Cost-Efficient Infrastructure:** Our integration with EigenLayer creates a novel economic model where agent usage costs are offset by staking rewards, making professional-level financial guidance accessible to more users.
- **Multi-Chain Support:** Unlike single-chain retirement solutions, our Connext integration enables truly diversified crypto retirement portfolios across multiple blockchains.
- **End-to-End Solution:** While competitors focus on either the setup process or portfolio management, MyIRA.fund provides a complete lifecycle solution from education to account creation to ongoing management.
- **Regulatory Compliance Focus:** Our agents are specifically designed to navigate the complex regulatory landscape of retirement accounts, ensuring all recommendations comply with IRA rules and regulations.
- **Web3-Native Experience:** Unlike traditional finance platforms that merely "add crypto," our solution is built from the ground up with blockchain technology, leveraging its security and transparency benefits.

## Trade-offs and shortcuts while building
Given the hackathon constraints, we made several strategic trade-offs:

- **Mocked Custodian Integrations:** Full integrations with IRA custodians require extensive partnership agreements. For the hackathon, we focused on the user workflow and mocked these integrations to demonstrate the end-to-end experience.
- **Limited Financial Data Sources:** In a production environment, we would integrate with more comprehensive financial data sources. For now, we're working with a limited dataset to demonstrate core functionality.
- **Simplified Tax Calculation:** The full complexity of retirement tax calculations deserves dedicated attention. Our current implementation focuses on the most common tax scenarios rather than edge cases.
- **Testnet Deployment:** While our code supports mainnet, we've deployed on testnets to allow for safe demonstrations without requiring real assets.

## Future improvements will include:
- Formal custodian partnerships and API integrations
- Expanded financial data sources and market analytics
- Comprehensive tax calculation engine
- Enhanced security audits and compliance certifications

## Additional Features
During the ETHDenver buildathon, we added the following new features:

- **Olas Integration:** Complete integration with the Olas protocol for agent creation, configuration, and execution, enabling users to leverage specialized retirement planning components.
- **EigenLayer Staking Mechanism:** Implementation of a novel cost-offsetting model where users can stake tokens to reduce agent execution costs.
- **Cross-chain Portfolio Visualization:** Added support for viewing retirement assets across multiple blockchains in a unified interface.
- **Streaming Agent Responses:** Enhanced the user experience with real-time streaming of agent responses for more interactive guidance.
- **SIWE Authentication:** Implemented secure wallet-based authentication to streamline the user experience while maintaining high security standards.

## Technologies I used
Next.js, React, TypeScript, Python, FastAPI, PostgreSQL, Prisma, Shadcn UI, Wagmi, Viem, Sign-In With Ethereum (SIWE), Olas Protocol, EigenLayer, Connext, Scroll, Base, OpenAI, WebSockets, Redis, Docker, Kubernetes

## Links
- [GitHub Repository](https://github.com/weown-ai/myira-fund)
- [MyIRA Website](https://myira.fund)
- [MyIRA App](https://app.myira.fund)
- [Video Demo](https://www.youtube.com/watch?v=myIRA_demo_2025)

## Cover Image
[Upload cover image representing MyIRA.fund]

## Pictures
[Upload 5 screenshots of the MyIRA.fund platform]

## Logo
[]

## Select platforms this project is built for
- Web

## Applicable Sponsor Bounties
- EigenLayer: Best Use of AVS
- Olas: Best Agent Implementation
- Connext: Cross-chain Innovation Award
- Scroll: Best ZK Application
- Base: Best User Experience
