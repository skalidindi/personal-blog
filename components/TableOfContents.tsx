"use client";

import { useEffect, useState } from "react";

import type { PostHeading } from "@/util/post";

const MINIMUM_HEADINGS = 3;
const ACTIVE_HEADING_OFFSET = 160;

export function TableOfContents({ headings }: { headings: PostHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    let frame: number | undefined;
    function updateActiveHeading() {
      let current = elements[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top > ACTIVE_HEADING_OFFSET) {
          break;
        }
        current = element;
      }
      setActiveId(current.id);
    }

    function scheduleUpdate() {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(updateActiveHeading);
    }

    updateActiveHeading();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [headings]);

  if (headings.length < MINIMUM_HEADINGS) {
    return null;
  }

  return (
    <nav
      aria-label="On this page"
      className="border-l-2 border-gray-200 pl-4 text-sm lg:sticky lg:top-8 lg:self-start dark:border-gray-700"
    >
      <h2 className="mb-3 font-bold">On this page</h2>
      <ol className="grid gap-2 text-gray-600 dark:text-gray-300">
        {headings.map((heading) => {
          const active = activeId === heading.id;

          return (
            <li
              className={heading.depth === 3 ? "pl-4" : undefined}
              key={heading.id}
            >
              <a
                aria-current={active ? "location" : undefined}
                className={`-ml-[18px] block border-l-2 py-0.5 pl-4 transition-colors ${
                  active
                    ? "border-blue-600 font-semibold text-blue-700 dark:border-blue-400 dark:text-blue-300"
                    : "border-transparent hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                href={`#${heading.id}`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
