"use client";

import * as React from "react";
import { slugify, cn } from "@/lib/utils";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Heading = {
  level: number;
  text: string;
  id: string;
};

function extractHeadingsFromMDX(source: string): Heading[] {
  const lines = source.split(/\r?\n/);
  const headings: Heading[] = [];
  for (const line of lines) {
    const m = /^(#{1,6})\s+(.+)$/.exec(line.trim());
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/#+\s*$/g, "").trim();
      const id = slugify(text);
      headings.push({ level, text, id });
    }
  }
  return headings;
}

export function TableOfContents({
  source,
  maxDepth = 3,
  className,
}: {
  source: string;
  maxDepth?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}) {
  const headings = React.useMemo(
    () => extractHeadingsFromMDX(source).filter((h) => h.level <= maxDepth),
    [source, maxDepth]
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!headings.length) return;
    const visible = new Set<string>();
    let raf: number | null = null;
    let ticking = false;

    const updateActive = () => {
      // If scrolled to bottom, force-select the last heading
      const doc = document.documentElement;
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
      if (scrolledToBottom && headings.length) {
        setActiveId((prev) =>
          prev === headings[headings.length - 1].id
            ? prev
            : headings[headings.length - 1].id
        );
        return;
      }

      const OFFSET = 12; // px from viewport top to consider a heading "active"
      const positions = headings
        .map((h) => {
          const el = document.getElementById(h.id);
          return el ? { id: h.id, top: el.getBoundingClientRect().top } : null;
        })
        .filter((v): v is { id: string; top: number } => v !== null);

      if (!positions.length) return;

      // Pick the closest heading whose top is at or above the viewport top (within OFFSET px)
      const atOrAbove = positions.filter((p) => p.top <= OFFSET);
      let nextId: string | null = null;
      if (atOrAbove.length) {
        // closest to top -> max top
        nextId = atOrAbove.reduce((acc, cur) =>
          acc.top > cur.top ? acc : cur
        ).id;
      } else {
        // none above, choose the first heading still below top (closest to top)
        const below = positions.filter((p) => p.top > OFFSET);
        nextId = below.length
          ? below.reduce((acc, cur) => (acc.top < cur.top ? acc : cur)).id
          : positions[0].id;
      }

      setActiveId((prev) => (prev === nextId ? prev : nextId));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(updateActive);
      },
      {
        rootMargin: "0px 0px -40% 0px",
        threshold: [0.25, 0.6],
      }
    );

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    // Initial compute and listeners
    raf = requestAnimationFrame(updateActive);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onScroll as EventListener);
      window.removeEventListener("hashchange", onScroll as EventListener);
    };
  }, [headings]);

  if (!headings.length) return null;

  // Floating rail + hover card with full list
  return (
    <div
      className={cn(
        "fixed right-4 top-1/3 z-40 hidden lg:flex",
        "flex-col items-center gap-2",
        className
      )}
      aria-label="Table of contents"
    >
      <HoverCard openDelay={150}>
        <HoverCardTrigger asChild>
          <div className="flex flex-col items-end gap-2 ">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={cn(
                  "block rounded-full  transition-colors",
                  // constant thin height to be a line
                  "h-0.5",
                  // width by level for hierarchy (h1 widest)
                  h.level === 1 && "w-10",
                  h.level === 2 && "w-8",
                  h.level === 3 && "w-6",
                  h.level === 4 && "w-4",
                  h.level >= 5 && "w-2",
                  // color states
                  activeId === h.id
                    ? "bg-foreground"
                    : "bg-muted hover:bg-muted-foreground/50"
                )}
                title={h.text}
                aria-label={h.text}
              />
            ))}
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          side="left"
          align="center"
          className="w-64 max-w-[calc(100vw-3rem)] p-0 shadow-sm"
        >
          <div className="px-4 pt-4 pb-2 text-xs font-medium text-muted-foreground">
            On this page
          </div>
          <ScrollArea className="h-72 w-full px-2 pb-3">
            <nav>
              <ul className="space-y-1">
                {headings.map((h) => (
                  <li
                    key={h.id}
                    className={cn(
                      h.level === 1 && "ml-0",
                      h.level === 2 && "ml-2",
                      h.level === 3 && "ml-4",
                      h.level === 4 && "ml-6",
                      h.level === 5 && "ml-8",
                      h.level >= 6 && "ml-10"
                    )}
                  >
                    <Link
                      href={`#${h.id}`}
                      className={cn(
                        "block rounded px-2 py-1 text-sm whitespace-normal break-words",
                        activeId === h.id
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {h.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

export type { Heading };
