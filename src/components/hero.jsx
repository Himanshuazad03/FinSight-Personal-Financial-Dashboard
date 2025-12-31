"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import Reveal from "./Revel";
import dashBoard from "../../public/dashboard.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-40 pb-20 px-4 ">
      <div className="container mx-auto text-center">
        {/* Small badge / kicker */}
        <Reveal>
          <div className="mb-6 inline-flex items-center rounded-full border px-4 py-1 text-sm text-gray-600">
            <span className="mr-2">✨</span>
            AI-Powered Personal Finance Platform
          </div>
        </Reveal>

        {/* Main headline */}
        <Reveal delay={0.1}>
          <h1 className="text-4xl md:text-7xl lg:text-[96px] font-semibold leading-tight tracking-tight mb-6">
            Smarter Control <br className="hidden md:block" />
            <span className="gradient-title">Over Your Money</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Track expenses, manage budgets, and receive{" "}
            <span className="black-gradient font-medium">
              smarter financial decisions
            </span>{" "}
            that help you understand spending patterns and improve financial
            discipline — all from one secure dashboard.
          </p>
        </Reveal>

        {/* Supporting text */}
        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="px-10 cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>
        </Reveal>

        {/* Product preview */}
        <Reveal delay={0.3}>
          <div className="rounded-xl border bg-white shadow-2xl p-2 max-w-6xl mx-auto">
            <Image
              src={dashBoard}
              alt="Dashboard"
              className="w-full h-full object-contain"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default HeroSection;
