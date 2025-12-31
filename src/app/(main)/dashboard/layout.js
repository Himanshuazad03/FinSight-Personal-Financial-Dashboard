"use client";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { useUser } from "@clerk/nextjs";

export default function Layout({ children }) {

  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader width="100%" color="#9333ea" />;
  }

  return (
    <div className="px-10">
      <div className="flex items-center justify-between mb-5 pl-4">
        <h1 className="text-6xl font-bold tracking-tight gradient-title">
          Welcome, {user.firstName}
        </h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
