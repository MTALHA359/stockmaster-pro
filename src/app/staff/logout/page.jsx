'use client';
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/' }); // Redirect after logout
  }, []);

  return (
    <div className="flex h-screen items-center justify-center text-xl font-semibold">
      Logging out...
    </div>
  );
}
