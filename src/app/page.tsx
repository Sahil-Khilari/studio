import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { HardDrive, Star, Trash2, Cloud, LifeBuoy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import FileManager from "@/components/file-manager";

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Cloud className="text-primary h-6 w-6" />
            <h1 className="text-lg font-semibold font-headline">Cloud-Drive</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="My Drive" isActive>
                <HardDrive />
                My Drive
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Favorites">
                <Star />
                Favorites
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Trash">
                <Trash2 />
                Trash
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Storage</span>
              <span className="text-sm font-medium">8.5 / 15 GB</span>
            </div>
            <Progress value={56} className="h-2" />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/95 p-4 backdrop-blur-sm md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-4">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40" alt="@user" data-ai-hint="user avatar" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <FileManager />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
