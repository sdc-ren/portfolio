"use client";

import { useActionState, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { login } from "./actions";
import { ActionLink } from "@/components/action-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "./login.module.scss";

export default function Login() {
  const [state, action, pending] = useActionState(login, { error: "" });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main id="main" className={styles.page}>
      <aside
        className={styles.brandPanel}
        aria-label="Portfolio administration"
      >
        <ActionLink href="/" className={styles.brand} tooltip="Open portfolio">
          <img src="/icon.svg" alt="SDC" width={40} height={40} />
          <span>
            <strong>Portfolio</strong>
            <span>Content workspace</span>
          </span>
        </ActionLink>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <span />
            Behind the portfolio
          </p>
          <h2>Your work deserves a place of its own.</h2>
          <p className={styles.summary}>
            Keep your projects, experience and CV in one workspace. Update a
            draft, review it, then publish when it is ready.
          </p>
          <div className={styles.workspace}>
            <div className={styles.windowHeader}>
              <span className={styles.windowDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>portfolio.workspace</span>
              <LockKeyhole size={13} aria-hidden="true" />
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                <FolderKanban size={18} aria-hidden="true" />
              </span>
              <div>
                <strong>Project library</strong>
                <p>The details behind your work.</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                <FileText size={18} aria-hidden="true" />
              </span>
              <div>
                <strong>Profile & CV</strong>
                <p>One source for your website and PDF.</p>
              </div>
            </div>
            <div className={styles.workflow}>
              <span>
                <Check size={12} aria-hidden="true" />
                Draft
              </span>
              <ArrowRight size={13} aria-hidden="true" />
              <span>Review</span>
              <ArrowRight size={13} aria-hidden="true" />
              <span>Publish</span>
            </div>
          </div>
        </div>
        <p className={styles.panelFooter}>
          A little less upkeep. More time to build.
        </p>
      </aside>
      <section className={styles.signInPanel} aria-labelledby="login-heading">
        <div className={styles.topbar}>
          <span className={styles.adminLabel}>
            <LockKeyhole size={13} aria-hidden="true" />
            Admin access
          </span>
          <ActionLink href="/" className={styles.backLink}>
            <ArrowLeft size={14} aria-hidden="true" />
            Back to portfolio
          </ActionLink>
        </div>
        <div className={styles.formArea}>
          <div className={styles.formIntro}>
            <span className={styles.lockIcon}>
              <LockKeyhole size={22} aria-hidden="true" />
            </span>
            <h1 id="login-heading">Welcome back</h1>
            <p>Sign in to manage your portfolio.</p>
          </div>
          <form action={action} className={styles.form} aria-busy={pending}>
            <div className={styles.field}>
              <Label htmlFor="email">Email address</Label>
              <div className={styles.inputWrap}>
                <Mail
                  size={17}
                  aria-hidden="true"
                  className={styles.inputIcon}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                  required
                  disabled={pending}
                  className={styles.emailInput}
                  aria-describedby={state.error ? "login-error" : undefined}
                />
              </div>
            </div>
            <div className={styles.field}>
              <Label htmlFor="password">Password</Label>
              <div className={styles.inputWrap}>
                <LockKeyhole
                  size={17}
                  aria-hidden="true"
                  className={styles.inputIcon}
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  disabled={pending}
                  className={styles.passwordInput}
                  aria-describedby={state.error ? "login-error" : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={styles.passwordToggle}
                  disabled={pending}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? (
                    <EyeOff size={17} aria-hidden="true" />
                  ) : (
                    <Eye size={17} aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
            {state.error && (
              <p id="login-error" role="alert" className={styles.error}>
                {state.error}
              </p>
            )}
            <Button type="submit" disabled={pending} className={styles.submit}>
              {pending ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
          <p className={styles.hint}>
            <LockKeyhole size={13} aria-hidden="true" />
            <span>Access is limited to authorized administrators.</span>
          </p>
        </div>
        <p className={styles.formFooter}>Portfolio administration</p>
      </section>
    </main>
  );
}
