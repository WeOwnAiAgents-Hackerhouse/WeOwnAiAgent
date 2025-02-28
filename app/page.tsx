'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InvestmentChart } from '@/components/investment-chart';
import { AgentUsageChart } from '@/components/agent-usage-chart';
import { PricingSection } from '@/components/pricing-section';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0b14] text-white">
      <nav className="fixed top-0 w-full flex justify-between items-center p-6 z-10 bg-[#0a0b14]/80 backdrop-blur-sm">
        <div className="flex items-center">
          <span className="text-xl font-bold"> WeOwn Agent Box </span>
        </div>
        <div className="flex space-x-6">
          <Link href="#features">Features</Link>
          <Link href="#analytics">Analytics</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#documentation">Documentation</Link>
        </div>
        <div>
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-gray-800">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center px-4 mt-32 mb-24">
        <div className="mb-12">
          <Link href="https://twitter.com/yourusername" target="_blank">
            <Button variant="outline" className="rounded-full bg-[#1a1b2e] text-white border-none hover:bg-[#2a2b3e]">
              Follow along our channel
            </Button>
          </Link>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
           We Own Agent Box
        </h1>
        
        <p className="text-xl mb-12 text-gray-300">
          SaaS platform to setup robust AI agent verticals 
        </p>
        
        <div className="flex gap-4 mt-8 justify-center">
          <Link href="/login">
            <Button className="bg-white text-[#0a0b14] hover:bg-gray-200">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="border-white text-white hover:bg-gray-800">
              Sign Up
            </Button>
          </Link>
        </div> 
      </div>

      {/* Analytics Section */}
      <div id="analytics" className="w-full max-w-6xl mx-auto px-4 mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-zinc-800/50 p-6 rounded-xl">
            <InvestmentChart />
          </div>
          <div className="bg-zinc-800/50 p-6 rounded-xl">
            <AgentUsageChart />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="w-full max-w-6xl mx-auto px-4 mb-24">
        <PricingSection />
      </div>

      {/* Footer */}
      <footer className="w-full py-8 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2023 WeOwn Agent Box. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white">Terms</Link>
            <Link href="#" className="text-gray-400 hover:text-white">Privacy</Link>
            <Link href="#" className="text-gray-400 hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}