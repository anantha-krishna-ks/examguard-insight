import { NavLink, useLocation } from "react-router-dom";
import {
  Monitor,
  User,
  FileText,
  GitMerge,
  Briefcase,
  Settings,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Live Monitor", url: "/admin", icon: Monitor },
  { title: "Candidate 360", url: "/admin/candidates", icon: User },
  { title: "Item Inspector", url: "/admin/items", icon: FileText },
  { title: "Similarity Explorer", url: "/admin/similarity", icon: GitMerge },
  { title: "Cases", url: "/admin/cases", icon: Briefcase },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin" || currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-semibold shadow-md border-l-4 border-primary-foreground/20" 
      : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar
      className={collapsed ? "w-12" : "w-56"}
      collapsible="icon"
    >
      <div className="h-full flex flex-col">
        <SidebarTrigger className="m-2 self-end" />

        <SidebarContent className="flex-1 px-2">
          {/* Header Section */}
          {!collapsed && (
            <div className="p-3 border-b mb-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">ExamGuard Forensics</span>
              </div>
            </div>
          )}
          
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/admin"}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="text-sm truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          </SidebarGroup>
          
          {/* User Section - Fixed at bottom */}
          {!collapsed && (
            <div className="mt-auto p-3 border-t">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/avatars/admin.png" alt="Admin" />
                      <AvatarFallback className="text-xs">AD</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </SidebarContent>
      </div>
    </Sidebar>
  );
}