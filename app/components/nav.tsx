import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const navItems = {
  "/": {
    name: "about",
  },
  "/writing": {
    name: "writing",
  },
};

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-4 sm:mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row  items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row items-center space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all font-mono text-muted-foreground hover:text-primary flex align-middle relative py-1 px-2 m-1"
                >
                  {name}
                </Link>
              );
            })}
          </div>
          <ThemeToggle className="size-7  hidden sm:inline-flex" />
        </nav>
      </div>
    </aside>
  );
}
