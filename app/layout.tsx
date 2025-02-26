import React from 'react';
import 'globals.css'; // Import global styles if you have any
// import { SidebarProvider } from 'components/ui/sidebar'; // Import SidebarProvider
//import { AppSidebar } from 'components/app-sidebar'; // Import your sidebar component
import { Button } from 'components/ui/button';
import { Logo } from 'components/logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        {/* <AppSidebar /> */}
        
        {/* Main Content */}
        <main className="flex-grow flex flex-col">
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

          {/* Render children (page content) */}
          {children}
        </main>
      </div>
    // </SidebarProvider>
  );
}