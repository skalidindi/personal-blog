import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export function MdxLink({
  children,
  href = "",
  ...props
}: ComponentPropsWithoutRef<"a">) {
  const isInternal =
    (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  const isExternal = /^https?:\/\//.test(href) || href.startsWith("//");

  return (
    <a {...props} href={href} rel={isExternal ? "external" : props.rel}>
      {children}
      {isExternal && (
        <>
          <ExternalLink
            aria-hidden="true"
            className="ml-[0.2em] inline align-[-0.1em]"
            size={14}
          />
          <span className="sr-only">, external site</span>
        </>
      )}
    </a>
  );
}
