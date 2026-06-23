"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface RelatedToolItem {
  name: string;
  url: string;
  description: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  categoryUrl: string;
  howToUse: string[];
  benefits: string[];
  faqs: FAQItem[];
  relatedTools: RelatedToolItem[];
  children: React.ReactNode;
}

export default function ToolLayout({
  title,
  description,
  category,
  categoryUrl,
  howToUse,
  benefits,
  faqs,
  relatedTools,
  children,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen py-8 md:py-12 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-secondary-text">
          <Link href="/" className="hover:text-accent flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={categoryUrl} className="hover:text-accent transition-colors">
            {category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-primary-text font-medium">{title}</span>
        </nav>

        {/* SECTION 1: Tool Hero */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center md:text-left mb-8 md:mb-12 space-y-3"
        >
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-inset ring-accent/20">
            {category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-primary-text">
            {title}
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-secondary-text leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* SECTION 2: Tool Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 md:mb-16 rounded-2xl border border-border-color bg-card-bg shadow-card p-6 md:p-8"
        >
          {children}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* SECTION 3: How To Use */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-heading font-bold text-primary-text">
              How to Use {title}
            </h2>
            <ol className="relative border-l border-border-color pl-6 space-y-6">
              {howToUse.map((step, idx) => (
                <li key={idx} className="relative">
                  <span className="absolute left-[-37px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
                    {idx + 1}
                  </span>
                  <p className="text-sm md:text-base text-primary-text font-medium leading-tight">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* SECTION 4: Benefits */}
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-primary-text">
              Benefits & Features
            </h2>
            <ul className="space-y-3">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-secondary-text leading-relaxed">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SECTION 5: Frequently Asked Questions */}
        {faqs.length > 0 && (
          <div className="border-t border-border-color pt-12 mb-12 md:mb-16 space-y-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-text">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-secondary-text mt-1.5">
                Common questions about our {title} tool.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-border-color p-5 bg-card-bg hover:shadow-premium transition-shadow duration-200">
                  <h3 className="font-heading font-semibold text-base text-primary-text mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-secondary-text leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: Related Tools */}
        {relatedTools.length > 0 && (
          <div className="border-t border-border-color pt-12">
            <h2 className="text-2xl font-heading font-bold text-primary-text mb-6">
              Related Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((tool, idx) => (
                <Link
                  key={idx}
                  href={tool.url}
                  className="block p-5 rounded-xl border border-border-color bg-card-bg hover:bg-hover-bg hover:border-accent hover:-translate-y-0.5 transition-all duration-200"
                >
                  <h3 className="font-heading font-semibold text-primary-text hover:text-accent transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-secondary-text mt-1.5 line-clamp-2">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
