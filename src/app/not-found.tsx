import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-3xl p-12">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <Link href="/" className="mt-6 inline-block text-teal-300">
        Return home →
      </Link>
    </main>
  );
}
