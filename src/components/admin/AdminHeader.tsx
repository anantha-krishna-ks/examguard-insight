import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, Users, Activity } from "lucide-react";

export function AdminHeader() {
  const [activeCandidates, setActiveCandidates] = useState(1247);
  const [systemHealth, setSystemHealth] = useState(99.8);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCandidates(prev => prev + Math.floor(Math.random() * 3) - 1);
      setSystemHealth(prev => Math.max(95, Math.min(100, prev + (Math.random() - 0.5) * 0.2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: number) => {
    if (health >= 99) return "bg-admin-normal-safe";
    if (health >= 95) return "bg-admin-warning";
    return "bg-admin-critical-alert";
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 relative z-20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">ExamGuard Forensics</span>
        </div>
      </div>

      <div className="flex items-center space-x-6 pr-80"> {/* Right padding to avoid Alert Feed */}
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{activeCandidates.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">Active</span>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth)}`} />
            <span className="text-sm font-medium">{systemHealth.toFixed(1)}%</span>
          </div>
          <span className="text-xs text-muted-foreground">Health</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}