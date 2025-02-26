'use client';

import { FaReact } from 'react-icons/fa';



import React from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input'; // Importing Input component
import { Logo } from 'components/logo';
const Page: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center">
          <Logo />
        </div>
        <nav className="flex-grow mx-4">
          <ul className="flex justify-center space-x-4">
            <li><Button variant="link">Features</Button></li>
            <li><Button variant="link">Pricing</Button></li>
            <li><Button variant="link">Blog</Button></li>
            <li><Button variant="link">Documentation</Button></li>
          </ul>
        </nav>
        <div className="flex items-center">
          <Button variant="outline">Login</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold mb-4">An example app built using Next.js 13 server components.</h1>
        <p className="mb-6">I'm building a web app with Next.js 13 and open sourcing everything. Follow along as we figure this out together.</p>
        <div className="flex space-x-4 mb-8">
          <Button variant="default">Get Started</Button>
          <Button variant="secondary">GitHub</Button>
        </div>

        {/* Features Section */}
        <section className="w-full max-w-4xl mx-auto text-left">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold">Feature 1</h3>
              <p>Description of feature 1.</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold">Feature 2</h3>
              <p>Description of feature 2.</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold">Feature 3</h3>
              <p>Description of feature 3.</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold">Feature 4</h3>
              <p>Description of feature 4.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-center p-4">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};
