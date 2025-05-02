import Link from "next/link";

export function BackNav({ href, heading }: { href: string; heading: string }) {
  return (
    <nav>
      <Link className="inline-flex items-center gap-2 group" href={href}>
        <svg
          className="w-6 h-6 text-gray-500 transition-transform transform group-hover:-translate-x-1 group-hover:text-blue-500"
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
        <span className="group-hover:text-blue-500">{heading}</span>
      </Link>
    </nav>
  );
}
