
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
