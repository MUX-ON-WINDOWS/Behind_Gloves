
import { ThemeToggle } from "./ThemeToggle";

export const DashboardHeader = () => {
  return (
    <header style={{ backgroundColor: "white" }} className="flex h-14 lg:h-16 items-center gap-4 border-b px-4 lg:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-xl">Goalkeeper Analytics</h1>
          <p className="text-sm text-muted-foreground">Performance metrics and visualization</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
};
