'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@myira/ui';
import { truncateAddress } from '@myira/utils';
import { useIsMobile } from '@myira/hooks';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Dynamically import components that depend on browser APIs
const Charts = dynamic(() => import('../components/charts'), { ssr: false });
const ChatInterface = dynamic(() => import('../components/chat/chat-interface').then(mod => mod.ChatInterface), { 
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
});

// Mock data for charts
const userAdoptionData = [
  { month: 'Jan', users: 400 },
  { month: 'Feb', users: 600 },
  { month: 'Mar', users: 800 },
  { month: 'Apr', users: 1200 },
  { month: 'May', users: 1800 },
  { month: 'Jun', users: 2400 },
];

const amountOnboardedData = [
  { month: 'Jan', amount: 10000 },
  { month: 'Feb', amount: 25000 },
  { month: 'Mar', amount: 45000 },
  { month: 'Apr', amount: 80000 },
  { month: 'May', amount: 120000 },
  { month: 'Jun', amount: 200000 },
];

const chainDistributionData = [
  { name: 'Ethereum', value: 45 },
  { name: 'Optimism', value: 25 },
  { name: 'Base', value: 20 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const [showChatApp, setShowChatApp] = useState(false);

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleGetStarted = () => {
    if (isConnected) {
      setShowChatApp(true);
    } else {
      connect();
    }
  };

  // Don't render wallet-dependent UI until mounted to avoid hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showChatApp && isConnected && address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">MyIRA AI Assistant</h1>
          <ChatInterface 
            onBack={() => setShowChatApp(false)} 
            userAddress={address}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">MyIRA</h1>
          </div>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-4">
                <Link href="/portfolio">
                  <Button variant="outline">View Portfolio</Button>
                </Link>
                <span className="text-sm text-gray-600">
                  {truncateAddress(address || '')}
                </span>
                <Button variant="secondary" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={handleConnect}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Your Intelligent Retirement Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MyIRA helps you manage your crypto portfolio across multiple chains with AI-powered insights and recommendations.
            </p>
            <div className="mt-8">
              <Button size="lg" onClick={handleGetStarted}>
                {isConnected ? 'Get Started' : 'Connect Wallet to Begin'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Characteristics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Multi-Chain Portfolio</h3>
              <p className="text-gray-700">
                Track and manage your assets across Ethereum, Optimism, Base, and more from a single dashboard.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-700">
                Get personalized recommendations and insights based on your portfolio performance and market trends.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Retirement Planning</h3>
              <p className="text-gray-700">
                Set retirement goals and track your progress with our advanced planning tools and simulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Project Details</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">About MyIRA</h3>
              <p className="text-gray-700 mb-4">
                MyIRA is a decentralized retirement planning platform that leverages blockchain technology and artificial intelligence to help users manage their crypto assets for long-term growth.
              </p>
              <p className="text-gray-700">
                Our platform integrates with multiple blockchain networks, providing a comprehensive view of your digital assets while offering smart recommendations to optimize your portfolio for retirement.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Technology Stack</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-100 p-3 rounded text-center">React</div>
                <div className="bg-gray-100 p-3 rounded text-center">Next.js</div>
                <div className="bg-gray-100 p-3 rounded text-center">Wagmi</div>
                <div className="bg-gray-100 p-3 rounded text-center">Ethers.js</div>
                <div className="bg-gray-100 p-3 rounded text-center">AI/ML</div>
                <div className="bg-gray-100 p-3 rounded text-center">TailwindCSS</div>
                <div className="bg-gray-100 p-3 rounded text-center">TypeScript</div>
                <div className="bg-gray-100 p-3 rounded text-center">OpenAI</div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Roadmap</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-500 rounded-full w-6 h-6 mt-1 mr-3 flex items-center justify-center text-white">✓</div>
                  <div>
                    <h4 className="font-medium">Phase 1: Multi-Chain Portfolio Tracking</h4>
                    <p className="text-gray-600">Connect wallets and view assets across multiple chains</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-500 rounded-full w-6 h-6 mt-1 mr-3 flex items-center justify-center text-white">2</div>
                  <div>
                    <h4 className="font-medium">Phase 2: AI-Powered Recommendations</h4>
                    <p className="text-gray-600">Personalized investment strategies based on risk profile</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-gray-300 rounded-full w-6 h-6 mt-1 mr-3 flex items-center justify-center text-white">3</div>
                  <div>
                    <h4 className="font-medium">Phase 3: Retirement Simulation</h4>
                    <p className="text-gray-600">Advanced modeling of retirement scenarios</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-gray-300 rounded-full w-6 h-6 mt-1 mr-3 flex items-center justify-center text-white">4</div>
                  <div>
                    <h4 className="font-medium">Phase 4: DeFi Integration</h4>
                    <p className="text-gray-600">Automated yield strategies for retirement funds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <Charts />

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Future?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect your wallet now and start building your crypto retirement portfolio with MyIRA.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleGetStarted}
          >
            {isConnected ? 'Launch Dashboard' : 'Connect Wallet'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MyIRA</h3>
              <p className="text-gray-400">
                Your Intelligent Retirement Assistant for the crypto age.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Discord</a>
                <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MyIRA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}