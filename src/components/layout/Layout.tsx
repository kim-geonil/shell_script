import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSidebarCollapsed } from '../../hooks/redux';
import { cn } from '../../utils/cn';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const sidebarCollapsed = useSidebarCollapsed();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] bg-background">
          <div className="container mx-auto px-4 lg:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Layout variants for different page types
export function DashboardLayout({ children }: LayoutProps) {
  return (
    <Layout>
      <div className="space-y-6">
        {children}
      </div>
    </Layout>
  );
}

export function EditorLayout({ children }: LayoutProps) {
  const sidebarCollapsed = useSidebarCollapsed();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export function SettingsLayout({ children }: LayoutProps) {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {children}
      </div>
    </Layout>
  );
}