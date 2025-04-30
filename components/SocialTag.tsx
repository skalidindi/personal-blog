export function SocialTag({
  href,
  title,
  label,
}: {
  href: string;
  title: string;
  label: string;
}) {
  return (
    <a
      rel="noopener noreferrer external"
      target="_blank"
      href={href}
      title={title}
    >
      {label}
    </a>
  );
}
