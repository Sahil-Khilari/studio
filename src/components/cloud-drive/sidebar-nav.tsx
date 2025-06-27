"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Cloud, File, Star, Clock, Trash2, Settings, HardDrive, Database } from 'lucide-react';
import { Progress } from '../ui/progress';

const navItems = [
  { href: '/my-files', label: 'My Files', icon: File },
  { href: '/starred', label: 'Starred', icon: Star },
  { href: '/recent', label: 'Recent', icon: Clock },
  { href: '/trash', label: 'Trash', icon: Trash2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="hidden border-r bg-background lg:flex">
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">SkyDrive</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton 
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2 rounded-lg border p-3">
            <div className='flex items-center gap-2 text-sm font-semibold'>
                <Database className="h-4 w-4" />
                <span>Storage</span>
            </div>
            <p className='text-xs text-muted-foreground'>Your storage is almost full.</p>
            <Progress value={85} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>8.5 GB of 10 GB used</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
