import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";
import { DemoAccountsMenu } from "@/components/demo-accounts-menu";

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="For UZH staff and students who want to book rooms."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[var(--uzh-blue)] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="mb-5 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Just here to explore? Skip the email step entirely with an instant demo account.
        </p>
        <DemoAccountsMenu currentRole="external" />
      </div>
      <SignupForm />
    </AuthCard>
  );
}
