import Link from "next/link";
import type { ReactNode } from "react";

export function SocialTag({
  href,
  title,
  label,
  svgIcon,
}: {
  href: string;
  title: string;
  label: string;
  svgIcon?: ReactNode;
  iconSize?: number;
  iconColor?: string;
}) {
  const content = (
    <>
      {svgIcon && <figure>{svgIcon}</figure>}
      <span>{label}</span>
    </>
  );
  const className =
    "inline-flex items-center rounded-lg border px-1 py-0.5 text-md border-foreground text-foreground gap-1";

  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href} title={title}>
        {content}
      </Link>
    );
  }

  return (
    <a
      className={className}
      rel="noopener noreferrer external"
      target="_blank"
      href={href}
      title={title}
    >
      {content}
    </a>
  );
}
