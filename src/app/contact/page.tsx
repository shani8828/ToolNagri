"use client";

import { useState } from "react";
import { Mail, MessageSquare, ShieldCheck, Send, Check } from "lucide-react";
import confetti from "canvas-confetti";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.6 },
      });
      setName("");
      setEmail("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="min-h-screen py-12 md:py-20 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-inset ring-accent/20">
            Contact Support
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-primary-text">
            Get in Touch
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base text-secondary-text leading-relaxed">
            Have questions, feedback, or need assistance? Reach out to the ToolNagri team, managed by Ayodhya Serenity. We are here to help.
          </p>
        </div>

        {/* Interface Panel */}
        <div className="rounded-2xl border border-border-color bg-card-bg shadow-card p-6 md:p-10">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success mx-auto">
                <Check className="h-6 w-6" />
              </span>
              <h2 className="text-2xl font-heading font-bold text-primary-text">
                Message Sent Successfully!
              </h2>
              <p className="text-sm text-secondary-text max-w-md mx-auto">
                Thank you for contacting us. Our support team at Ayodhya Serenity will review your inquiry and get back to you shortly at your registered email address.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent-light transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-semibold text-primary-text">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="block w-full rounded-lg border border-border-color px-4 py-2.5 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-semibold text-primary-text">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full rounded-lg border border-border-color px-4 py-2.5 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-sm font-semibold text-primary-text">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us details about your request, bug report, or tool suggestions..."
                  className="block w-full rounded-lg border border-border-color px-4 py-3 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-light focus:outline-none transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Send Message"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        {/* Company Card / Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border-color text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Mail className="h-5 w-5" />
            </span>
            <h3 className="font-heading font-semibold text-primary-text text-sm">Direct Support Email</h3>
            <a href="mailto:info.ayodhyaserenity@gmail.com" className="text-xs text-secondary-text hover:text-accent transition-colors">
              info.ayodhyaserenity@gmail.com
            </a>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MessageSquare className="h-5 w-5" />
            </span>
            <h3 className="font-heading font-semibold text-primary-text text-sm">Suggestions & Feedback</h3>
            <p className="text-xs text-secondary-text">
              We update our platform weekly. Let us know if you need any custom calculators or builders.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h3 className="font-heading font-semibold text-primary-text text-sm">Corporate Note</h3>
            <p className="text-xs text-secondary-text leading-relaxed">
              ToolNagri is owned and operated by Ayodhya Serenity. All correspondence is securely encrypted.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
