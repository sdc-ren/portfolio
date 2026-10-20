"use client";
import { useActionState } from "react";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function Login() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <main id="main" className="mx-auto max-w-md px-6 py-24">
      <p className="mb-4 text-xs uppercase tracking-widest text-primary">
        Portfolio CMS
      </p>
      <h1 className="mb-8 text-4xl font-semibold">Welcome back.</h1>
      <form action={action} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
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
