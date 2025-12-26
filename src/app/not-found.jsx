"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingDown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full text-center"
      >
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-white/60 px-4 py-1 text-sm text-blue-700">
          Financial Dashboard
        </div>

        {/* 🔥 Animated 404 (REPLACED PART) */}
        <div className="relative mb-6 flex justify-center">
          <motion.div
            className="relative inline-block"
          >
            <h1 className="text-8xl md:text-9xl font-bold tracking-tight text-slate-800">
              4
              <span className="relative inline-block mx-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                  0
                </span>
                <DollarSign
                  className="absolute inset-0 m-auto text-blue-600 opacity-20"
                  size={90}
                />
              </span>
              4
            </h1>

            {/* subtle financial indicator */}
            <div className="absolute -top-6 -right-10 w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center">
              <TrendingDown className="text-red-500" size={28} />
            </div>
          </motion.div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
          Page not found
        </h2>

        <p className="text-gray-600 text-lg mb-10">
          The page you’re looking for doesn’t exist or may have been moved.
          Let’s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="px-8">
              Go to Home
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="px-8">
              Open Dashboard
            </Button>
          </Link>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Error code: 404 • FinSight
        </p>
      </motion.div>
    </div>
  );
}
