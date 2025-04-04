
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { BarChart, LineChart, PieChart, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  {
    title: "Dashboard",
    icon: BarChart,
    active: true
  },
  {
    title: "Performance",
    icon: LineChart
  },
  {
    title: "Shot Map",
    icon: PieChart
  },
  {
    title: "Profile",
    icon: User
  },
  {
    title: "Settings",
    icon: Settings
  }
];

export const DashboardSidebar = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  
  return (
    <Sidebar className={cn(className)}>
      <SidebarHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Goalie Vision</h2>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className={item.active ? "text-primary" : ""}>
                <a href="#" className="flex items-center gap-3 px-3 py-2">
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
