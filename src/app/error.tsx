"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl font-bold">Content is temporarily unavailable</h1>
      <p className="my-6 text-muted-foreground">
        Please try again. If you manage this site, check the database and
        environment configuration.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
