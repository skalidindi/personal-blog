"use client";

import { Check, Copy } from "lucide-react";
import { type ComponentPropsWithoutRef, useRef, useState } from "react";

export function CodeBlock({
  children,
  className = "",
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const codeRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    const code = codeRef.current?.textContent;
    if (!code) {
      return;
    }

    await navigator.clipboard.writeText(code);
    setCopied(true);
  }

  return (
    <div className="group relative my-[1.7em]">
      <button
        aria-label={copied ? "Code copied" : "Copy code"}
        className="absolute top-3 right-3 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white/90 px-2.5 py-1.5 text-xs text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-600 dark:bg-gray-900/90 dark:text-gray-100 dark:hover:border-blue-400 dark:hover:text-blue-300"
        onClick={copyCode}
        type="button"
      >
        {copied ? (
          <Check aria-hidden="true" size={15} />
        ) : (
          <Copy aria-hidden="true" size={15} />
        )}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
      <pre
        className={`${className} !m-0 overflow-x-auto !pt-13`}
        ref={codeRef}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
