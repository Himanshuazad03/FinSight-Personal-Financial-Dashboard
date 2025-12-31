import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero";
import {
  statsData,
  howItWorksData,
  testimonialsData,
  featuresData,
} from "@/data/landing";
import Reveal from "@/components/Revel";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import Link from "next/link";
import Anni from "../../public/Anni.png"

export default function Home() {
  return (
    <>
      <div className=" min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <HeroSection />

        <Reveal delay={0.2}>
          <section className="py-14 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {statsData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {item.value}
                    </div>
                    <div className="text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section id="features" className="py-24">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  Core features designed for practical financial management
                </h2>
                <p className="text-gray-600 text-lg">
                  Each feature is thoughtfully built to solve real-world
                  challenges in tracking expenses, managing budgets, and gaining
                  actionable insights.
                </p>
              </div>

              {/* Features Grid */}
              <Reveal delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuresData.map((feature, index) => (
                    <Card
                      key={index}
                      className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <CardContent className="space-y-4 pt-4">
                        {/* Icon */}
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50">
                          {feature.icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-gray-900">
                          {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="max-w-3xl mx-auto text-center mb-20">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  How FinSight works
                </h2>
                <p className="text-gray-600 text-lg">
                  A simple, intuitive flow designed to help you understand and
                  improve your financial habits without complexity.
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {howItWorksData.map((step, index) => (
                  <div
                    key={index}
                    className="text-center px-6 transition-transform duration-300 hover:-translate-y-1"
                  >
                    {/* Icon container */}
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                      {step.icon}
                    </div>

                    {/* Step title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>

                    {/* Step description */}
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section className="py-22">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  Feedback from early users
                </h2>
                <p className="text-gray-600 text-lg">
                  Honest feedback from peers who explored{" "}
                  <span className="black-gradient">FinSight</span> during
                  development and testing.
                </p>
              </div>

              {/* Testimonials Grid */}
              <Reveal delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {testimonialsData.map((testimonial, index) => (
                    <div
                      key={index}
                      className="bg-white border rounded-xl p-6 text-center transition-shadow duration-300 hover:shadow-md"
                    >
                      {/* Avatar */}
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mx-auto mb-4"
                      />

                      {/* Name */}
                      <p className="font-medium text-gray-900 mb-3">
                        {testimonial.name}
                      </p>

                      {/* Quote */}
                      <p className="text-gray-700 leading-relaxed">
                        “{testimonial.quote}”
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section className="py-14 bg-slate-50 border-t">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-6 text-gray-900">
                  Ready to explore your financial data?
                </h2>

                <p className="text-md text-gray-600 max-w-2xl mx-auto mb-9">
                  Review your spending, budgets, and insights in a clear
                  dashboard designed for real-world financial management.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="px-10">
                      Open Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
