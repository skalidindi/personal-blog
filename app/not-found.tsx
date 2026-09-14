import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid h-screen place-items-center p-8">
      <section className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p>The page you requested does not exist.</p>
        <Link className="hover:underline" href="/">
          Return home
        </Link>
      </section>
    </main>
  );
}
