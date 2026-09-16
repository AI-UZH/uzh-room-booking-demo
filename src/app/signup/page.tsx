import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

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
      <SignupForm />
    </AuthCard>
  );
}
