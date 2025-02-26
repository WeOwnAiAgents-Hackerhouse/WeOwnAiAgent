'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0b14] text-white">
      <nav className="fixed top-0 w-full flex justify-between items-center p-6">
        <div className="flex items-center">
          <span className="text-xl font-bold"> WeOwn Agent Box </span>
        </div>
        <div className="flex space-x-6">
          <Link href="#features">Features</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#blog">Blog</Link>
          <Link href="#documentation">Documentation</Link>
        </div>
        <div>
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-gray-800">Login</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto text-center px-4 mt-20">
        <div className="mb-12">
          <Link href="https://twitter.com/yourusername" target="_blank">
            <Button variant="outline" className="rounded-full bg-[#1a1b2e] text-white border-none hover:bg-[#2a2b3e]">
              Follow along  our channel
            </Button>
          </Link>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
           We Own Agent Box
        </h1>
        
        <p className="text-xl mb-12 text-gray-300">
        SaaS platform to setup robust AI agent verticals 
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <Button className="w-full sm:w-auto bg-white text-black hover:bg-gray-200">
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/yourusername/yourrepo" target="_blank">
            <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-gray-800">
              GitHub
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}