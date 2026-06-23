export default function TermsOfService() {
  return (
    <div className="min-h-screen py-12 md:py-20 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-border-color pb-6 space-y-2">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Legal documents</span>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary-text">
            Terms of Service
          </h1>
          <p className="text-sm text-secondary-text">Last Updated: June 23, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none text-sm md:text-base text-secondary-text leading-relaxed space-y-6">
          <p>
            Welcome to ToolNagri. By utilizing our online tools, calculators, generators, and URL shortener, you agree to comply with and be bound by the following Terms of Service.
          </p>

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-primary-text">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-accent mb-2">
              Branding Note
            </h2>
            <p className="text-xs leading-relaxed">
              <strong>ToolNagri</strong> is a product of <strong>Ayodhya Serenity</strong>. ToolNagri is owned, operated, and managed by Ayodhya Serenity. All rights reserved.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-primary-text">1. License & Usage</h2>
            <p>
              We grant you a free, non-exclusive, revocable license to utilize our tools for personal and professional needs. You agree not to use our URL Shortener to distribute spam, malware, phishing links, or any copyrighted content without authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-primary-text">2. Termination of Short Links</h2>
            <p>
              Ayodhya Serenity reserves the right to review, block, or delete shortened links generated through our platform that are flagged for terms violations or reports of abuse.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-primary-text">3. Intellectual Property</h2>
            <p>
              The code patterns, logo, CSS design theme, global structure, and metadata are the property of Ayodhya Serenity. You may not copy, reverse engineer, or scrape the source directories without express written permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-primary-text">4. Contact Channels</h2>
            <p>
              If you have any feedback or reports of link violations, please contact us at:
            </p>
            <p className="font-semibold text-primary-text">
              Email: info.ayodhyaserenity@gmail.com
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
