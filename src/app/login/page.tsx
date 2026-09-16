import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { DemoAccountsMenu } from "@/components/demo-accounts-menu";

export default function LoginPage() {
  return (
    <AuthCard
      title="Log in"
      subtitle="UZH members can see live availability and book instantly."
      footer={
        <>
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-[var(--uzh-blue)] hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <div className="mb-5 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have a UZH account? Try the showcase instantly with a demo account.
        </p>
        <DemoAccountsMenu currentRole="external" />
      </div>
      <LoginForm />
    </AuthCard>
  );
}
