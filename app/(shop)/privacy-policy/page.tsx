"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.3em] mb-4 text-center">
            PRIVACY POLICY
          </h1>
          <p className="text-gray-500 text-sm tracking-[0.2em] mb-16 text-center uppercase">
            Last Updated: April 16, 2026
          </p>

          <div className="space-y-16 text-gray-300 leading-relaxed tracking-wide font-light">
            <section className="text-center md:text-left">
              <p className="mb-6 text-lg text-white/90">
                At EVO Carlton Trends, your privacy is important to us.
              </p>
              <p className="mb-6">
                We collect basic information such as your name, contact details, and shipping address to process orders and improve your experience.
                We do not sell or share your personal information with third parties except as required for order fulfillment and legal compliance.
                All transactions are secured using trusted payment gateways.
              </p>
              <p className="text-white/70 italic">
                By using our website, you agree to our privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">1. Information We Collect</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-white text-sm tracking-[0.2em] mb-4 uppercase">a) Personal Information</h3>
                    <ul className="space-y-3 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                      <li>Full Name</li>
                      <li>Email Address</li>
                      <li>Phone Number</li>
                      <li>Shipping and Billing Address</li>
                      <li>Payment Details</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white text-sm tracking-[0.2em] mb-4 uppercase">b) Non-Personal Information</h3>
                    <ul className="space-y-3 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                      <li>Browser type</li>
                      <li>IP address</li>
                      <li>Device information</li>
                      <li>Browsing behavior</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-sm tracking-[0.2em] mb-4 uppercase">c) Cookies & Tracking</h3>
                  <p className="text-sm opacity-70 leading-loose">
                    We use cookies and similar technologies to enhance your browsing experience, remember preferences, and analyze website traffic. Cookies help us understand how you interact with our platform to provide a more personalized service.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">2. How We Use Your Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "To process and deliver your orders",
                  "To communicate order updates and support queries",
                  "To improve our website and customer experience",
                  "To send promotional emails (opt-in only)",
                  "To detect and prevent fraudulent transactions"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-white/20 text-xs mt-1">0{i+1}</span>
                    <p className="text-sm opacity-80">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">3. Sharing of Information</h2>
              <p className="mb-6 opacity-80">We do not sell your personal data. However, we may share your information with:</p>
              <ul className="space-y-4 text-sm opacity-70 pl-0">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white shrink-0"/> Trusted third-party service providers (shipping, payments)</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white shrink-0"/> Legal authorities if required by law</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white shrink-0"/> Internal teams for order processing</li>
              </ul>
              <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-sm italic text-white/60">All third parties are contractually obligated to keep your data secure and use it only for the purposes we specify.</p>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">4. Data Security</h2>
                <ul className="space-y-3 text-sm opacity-70">
                  <li>• Secure servers and industry-standard encryption</li>
                  <li>• Trusted payment gateways</li>
                  <li>• Restricted access to sensitive information</li>
                </ul>
                <p className="mt-6 text-xs text-white/40 italic">No method of transmission over the internet is 100% secure.</p>
              </div>
              <div>
                <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">5. Cookies Policy</h2>
                <p className="text-sm opacity-70 leading-relaxed">
                  Cookies help us remember your preferences and improve website functionality. You can choose to disable cookies through your browser settings, but some features may not function properly.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">6. Your Rights</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Access your personal data",
                  "Request correction of incorrect data",
                  "Request deletion of your data",
                  "Opt-out of marketing communications"
                ].map((right, i) => (
                  <div key={i} className="border border-white/10 p-4 text-sm opacity-80 hover:bg-white/5 transition">
                    {right}
                  </div>
                ))}
              </div>
            </section>

            <div className="grid md:grid-cols-3 gap-10">
              <section className="md:col-span-1">
                <h3 className="text-sm text-white tracking-[0.2em] mb-4 uppercase">7. Third-Party Links</h3>
                <p className="text-xs opacity-60 leading-relaxed">We are not responsible for the privacy practices of linked third-party websites.</p>
              </section>
              <section className="md:col-span-1">
                <h3 className="text-sm text-white tracking-[0.2em] mb-4 uppercase">8. Data Retention</h3>
                <p className="text-xs opacity-60 leading-relaxed">We retain data only as long as necessary for orders, legal obligations, and disputes.</p>
              </section>
              <section className="md:col-span-1">
                <h3 className="text-sm text-white tracking-[0.2em] mb-4 uppercase">9. Children’s Privacy</h3>
                <p className="text-xs opacity-60 leading-relaxed">Our website is not intended for individuals under the age of 18.</p>
              </section>
            </div>

            <section className="pt-16 border-t border-white/10">
              <h2 className="text-2xl text-white tracking-[0.15em] mb-10 uppercase">11. Contact Us</h2>
              <div className="bg-white/5 p-8 rounded-xl border border-white/5 space-y-6">
                <p className="opacity-80">If you have any questions about this Privacy Policy, you can reach our team:</p>
                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-white/40 tracking-widest uppercase mb-1">Email</p>
                      <p className="text-sm">support@evocarltontrends.com</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 tracking-widest uppercase mb-1">Phone</p>
                      <p className="text-sm">+91 6282 036 765</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 tracking-widest uppercase mb-1">Address</p>
                    <p className="text-sm leading-relaxed">
                      Pattanchery, Palakkad,<br />
                      Kerala Pin: 678532
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-20 text-center">
              <p className="text-[10px] text-white/20 tracking-[0.5em] uppercase">
                © 2026 EVO CARLTON TRENDS. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
