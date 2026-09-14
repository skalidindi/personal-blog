import Link from "next/link";

export function BackNav({ href, heading }: { href: string; heading: string }) {
  return (
    <nav aria-label={`Back to ${heading}`}>
      <Link
        className="group inline-flex items-center gap-2 rounded-sm transition-colors hover:text-blue-600 active:scale-95 dark:hover:text-blue-400"
        href={href}
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6 text-gray-500 transition-transform group-hover:-translate-x-1 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span>{heading}</span>
      </Link>
    </nav>
  );
}
