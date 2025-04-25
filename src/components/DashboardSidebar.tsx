import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter
} from "@/components/ui/sidebar";
import { BarChart, LineChart, Settings, User, Calendar, Video, Map, LogOut, ChartScatter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  {
    title: "Dashboard",
    icon: BarChart,
    path: "/"
  },
  {
    title: "Data Overview",
    icon: Calendar,
    path: "/data-overview"
  },
  {
    title: "Video Analysis",
    icon: Video,
    path: "/video-upload"
  },
  {
    title: "Shotmap",
    icon: ChartScatter,
    path: "/shotmap"
  },
  // {
  //   title: "Performance",
  //   icon: LineChart,
  //   path: "/performance"
  // },
  {
    title: "Profile",
    icon: User,
    path: "/profile"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings"
  }
];

export const DashboardSidebar = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <Sidebar className={cn(className)}>
      <SidebarHeader className="flex pl-4 justify-between">
        <h2 className="text-lg font-semibold">Goalie Vision</h2>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className={isActive ? "text-primary font-semibold" : ""}>
                  <Link to={item.path} className="flex items-center gap-3 px-3 py-2">
                    <item.icon size={18} />
                    <span>{item.title}</span>
                    {/* {item.title === "Data Overview" && <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Main</span>} */}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 text-left hover:text-destructive"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};
