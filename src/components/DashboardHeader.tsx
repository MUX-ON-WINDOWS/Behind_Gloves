import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { BarChart, LineChart, Settings, User, Calendar, Video, Map, LogOut, ChartScatter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

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

export const DashboardHeader = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { logout } = useAuth();
  
  return (
    <header className={`md:static sticky top-0 z-50 flex h-14 lg:h-16 items-center gap-4 border-b px-4 lg:px-6 ${theme === 'light' ? 'bg-[#FFFFFF]' : 'bg-background'}`}>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px] flex flex-col">
              <SheetHeader>
                <SheetTitle>Goalie Vision</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6 flex-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.title}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent ${
                        isActive ? "text-primary font-semibold" : ""
                      }`}
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto">
                <Separator className="my-4" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-destructive"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
          <div>
            <h1 className="text-lg font-semibold md:text-xl">Goalkeeper Analytics</h1>
            <p className="text-sm text-muted-foreground">Performance metrics and visualization</p>
          </div>
        </div>
        {/* <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <Switch
              id="theme-switch"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => {
                setTheme(checked ? 'dark' : 'light');
              }}
            />
            <Moon className="h-4 w-4" />
          </div>
        </div> */}
      </div>
    </header>
  );
};
