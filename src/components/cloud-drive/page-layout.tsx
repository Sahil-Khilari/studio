'use client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from './header';
import { SidebarNav } from './sidebar-nav';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SidebarNav />
        <main className="flex flex-1 flex-col">
          <Header />
          <div className="flex-1 overflow-y-auto p-4 pt-6 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
