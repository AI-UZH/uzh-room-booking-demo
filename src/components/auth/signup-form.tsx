"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoAccountsMenu } from "@/components/demo-accounts-menu";
import { signUpWithPassword } from "@/actions/auth-actions";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signUpWithPassword({ email, password, fullName });
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <CheckCircle2 className="size-8 text-[var(--uzh-green)]" />
        <p className="text-sm font-medium text-foreground">Check your inbox</p>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a confirmation link to {email}. Follow it to activate your account.
        </p>
        <div className="mt-3 w-full rounded-lg border border-dashed border-border bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">
            Email delivery in this demo can be slow or occasionally not arrive. Don&apos;t want to
            wait? Explore right now with an instant demo account instead — no email required.
          </p>
          <DemoAccountsMenu currentRole="external" triggerClassName="mt-2 w-full justify-center" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Full name
        </Label>
        <Input
          id="fullName"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Doe"
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          UZH email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@uzh.ch"
        />
      </div>
      <div>
        <Label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="mt-1 w-full bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90"
      >
        {loading ? "Creating account…" : "Sign up"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        New accounts start as a Member — booking access UZH staff and students get by default.
      </p>
    </form>
  );
}
