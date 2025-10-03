// src/components/auth/auth-wrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function verifyAuth() {
      try {
        if (pathname === "/authentication/login") {
          setVerified(true);
          return;
        }

        const res = await fetch("/api/auth/verify", { credentials: "include" });
        if (!res.ok) throw new Error("Unauthorized");
        setVerified(true);
      } catch (err) {  console.error("Error deleting file:", err);
        router.push("/authentication/login");
      }
    }

    verifyAuth();
  }, [pathname, router]);

  if (!verified) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}