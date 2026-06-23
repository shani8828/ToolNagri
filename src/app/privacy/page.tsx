export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12 md:py-20 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-border-color pb-6 space-y-2">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Legal documents</span>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary-text">
            Privacy Policy
          </h1>
          <p className="text-sm text-secondary-text">Last Updated: June 23, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none text-sm md:text-base text-secondary-text leading-relaxed space-y-6">
          <p>
            Welcome to ToolNagri. We take your privacy very seriously. This policy describes how we collect, use, and process data on ToolNagri (https://toolnagri.vercel.app).
          </p>

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-primary-text">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-accent mb-2">
              Corporate Branding Notice
            </h2>
            <p className="text-xs leading-relaxed">
              <strong>ToolNagri</strong> is a product of <strong>Ayodhya Serenity</strong>. ToolNagri is owned, operated, and managed by Ayodhya Serenity. All rights reserved.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-primary-text">1. Data Processing Model</h2>
            <p>
              ToolNagri is designed to be a client-side first platform. This means that for the majority of our tools, including our <strong>Age Calculator</strong>, <strong>Image Compressor</strong>, <strong>JPG to WebP Converter</strong>, <strong>PDF Merge tool</strong>, <strong>Password Generator</strong>, <strong>Base64 Converter</strong>, and <strong>JSON Formatter</strong>, all data processing occurs entirely within your web browser. 
            </p>
            <p>
              Your uploaded images, files, and text parameters are never uploaded to our servers, nor do we store them on our infrastructure. Your data remains strictly local and private to your device.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-primary-text">2. URL Shortener Storage</h2>
            <p>
              For our <strong>URL Shortener</strong>, we store the original destination URL, the custom or random slug, creation dates, and click frequencies in a secure MongoDB database. This metadata is collected solely to allow link redirections and is displayed to you on your device's local dashboard using cookie-free localStorage keys.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-primary-text">3. Third-Party Links</h2>
            <p>
              Our website links to our parent site (https://ayodhyaserenity.vercel.app) and potentially other third-party websites. We are not responsible for the privacy structures or practices of external services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-primary-text">4. Contact Information</h2>
            <p>
              For any questions regarding this privacy policy or data compliance, you can contact us at:
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
