import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Logic Induction — Proof Atlas",
  description:
    "A Lean 4 formalization of well-founded induction: informal math proofs, Lean proofs, and the dependency tree between them.",
  keywords: ["Lean 4", "well-founded induction", "formalization", "proof atlas", "set theory"],
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground min-h-screen flex flex-col"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
