import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-3">
        <Image
          src="/images/uzh-logo.svg"
          alt="Universität Zürich"
          width={140}
          height={48}
          className="h-9 w-auto"
        />
        <div className="h-8 w-px bg-border" aria-hidden="true" />
        <span className="text-sm font-semibold text-muted-foreground">Rooms</span>
      </Link>
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-5">{children}</div>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{footer}</p>
    </div>
  );
}
