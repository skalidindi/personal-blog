import { ReactNode } from "react";

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
  return (
    <a
      className="inline-flex items-center rounded-lg border px-1 py-0.5 text-md border-foreground text-foreground gap-1"
      rel="noopener noreferrer external"
      target="_blank"
      href={href}
      title={title}
    >
      {svgIcon && <figure>{svgIcon}</figure>}
      <span>{label}</span>
    </a>
  );
}
