
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { BarChart, LineChart, PieChart, Settings, User, Calendar, Save, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    title: "Dashboard",
    icon: BarChart,
    path: "/"
  },
  {
    title: "Match Overview",
    icon: Calendar,
    path: "/match-overview"
  },
  {
    title: "Performance",
    icon: LineChart,
    path: "/performance"
  },
  {
    title: "Shot Map",
    icon: PieChart,
    path: "/shot-map"
  },
  {
    title: "League",
    icon: Users,
    path: "/league"
  },
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
  
  return (
    <Sidebar className={cn(className)}>
      <SidebarHeader className="flex items-center justify-between">
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
                    {item.title === "Match Overview" && <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Main</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
