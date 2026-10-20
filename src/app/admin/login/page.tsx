"use client";
import { useActionState } from "react";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
export default function Login() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <main id="main" className="mx-auto max-w-md px-6 py-24">
      <p className="mb-4 text-xs uppercase tracking-widest text-primary">
        Portfolio CMS
      </p>
      <h1 className="mb-8 text-4xl font-semibold">Welcome back.</h1>
      <form action={action} className="space-y-5">
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {state.error && (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        )}
        <Button disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-xs text-muted-foreground">
        Administrator accounts are provisioned privately.
      </p>
    </main>
  );
}
