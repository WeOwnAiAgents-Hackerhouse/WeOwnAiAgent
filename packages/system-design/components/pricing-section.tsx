'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingSection() {
  return (
    <div className="w-full py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">Pricing Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {/* Basic Plan */}
        <div className="bg-zinc-800/50 p-8 rounded-xl border border-zinc-700 flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-2">Basic</h3>
          <div className="text-4xl font-bold mb-6 text-white">$9<span className="text-lg text-gray-400">/month</span></div>
          <ul className="space-y-3 mb-8 flex-grow">
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Up to 5 AI agents
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              200 messages per day
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Basic document generation
            </li>
          </ul>
          <Link href="/register" className="w-full">
            <Button className="w-full">Get Started</Button>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-zinc-800/50 p-8 rounded-xl border border-purple-500 flex flex-col relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
          <div className="text-4xl font-bold mb-6 text-white">$29<span className="text-lg text-gray-400">/month</span></div>
          <ul className="space-y-3 mb-8 flex-grow">
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Unlimited AI agents
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              1,000 messages per day
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Advanced document generation
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Custom integrations
            </li>
          </ul>
          <Link href="/register" className="w-full">
            <Button className="w-full bg-purple-500 hover:bg-purple-600">Get Started</Button>
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-zinc-800/50 p-8 rounded-xl border border-zinc-700 flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
          <div className="text-4xl font-bold mb-6 text-white">$99<span className="text-lg text-gray-400">/month</span></div>
          <ul className="space-y-3 mb-8 flex-grow">
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Everything in Pro
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Unlimited messages
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Dedicated support
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Custom AI model training
            </li>
          </ul>
          <Link href="/register" className="w-full">
            <Button className="w-full">Contact Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 