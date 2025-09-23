"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={cn(`cursor-pointer ${className}`)}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] transition-opacity duration-300 dark:opacity-0 animate-spin-once dark:animate-none" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] opacity-0 transition-opacity duration-300 dark:opacity-100 animate-none dark:animate-spin-once" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
