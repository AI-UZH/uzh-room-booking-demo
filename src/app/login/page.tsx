import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

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
      <LoginForm />
    </AuthCard>
  );
}
