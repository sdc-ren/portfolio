import { logout } from "../login/actions";
import { Button } from "@/components/ui/button";
export const metadata = {
  title: "Administrator access required",
  robots: { index: false, follow: false },
};
export default function AccessDenied() {
  return (
    <main id="main" className="mx-auto max-w-xl px-6 py-24">
      <h1 className="mb-6 text-3xl font-semibold">
        Administrator access required
      </h1>
      <p className="mb-8 text-muted-foreground">
        This account is signed in but has not been granted permission to manage
        this portfolio. Ask the site owner to provision the account, or sign in
        with a different account.
      </p>
      <form action={logout}>
        <Button variant="outline">Sign out</Button>
      </form>
    </main>
  );
}
