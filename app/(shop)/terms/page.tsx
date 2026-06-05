"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.3em] mb-4 text-center uppercase">
            TERMS OF SERVICE
          </h1>
          <p className="text-gray-500 text-sm tracking-[0.2em] mb-16 text-center uppercase">
            Last updated: January 28, 2025
          </p>

          <div className="space-y-16 text-gray-300 leading-relaxed tracking-wide font-light">
            
            <section>
              <p className="text-sm opacity-80 mb-6">
                Welcome to EVO Carlton Trends. These Terms of Service (“Terms”) govern your access to and use of our website, products, and services (collectively referred to as the “Services”).
              </p>
              <p className="text-sm opacity-80">
                By accessing, browsing, or purchasing from our website, you agree to comply with and be bound by these Terms, along with our Privacy Policy. If you do not agree with any part of these Terms, please refrain from using our Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                1. Eligibility & Use of Services
              </h2>
              <p className="text-sm opacity-80 mb-6">By using our Services, you confirm that:</p>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> You are at least 18 years old, or are using the website under the supervision of a parent or legal guardian.</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> You will use our website and products only for lawful purposes.</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> You will not misuse, copy, distribute, or exploit any part of our Services in violation of applicable laws or regulations.</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Any unauthorized or illegal use of our Services may result in immediate termination of access.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                2. Intellectual Property Rights
              </h2>
              <p className="text-sm opacity-80 mb-6">
                All content available on this website — including but not limited to text, graphics, logos, product images, designs, branding, icons, videos, and software — is the exclusive property of EVO Carlton Trends and is protected under applicable copyright, trademark, and intellectual property laws.
              </p>
              <p className="text-sm opacity-80">
                You may not reproduce, modify, distribute, republish, or commercially exploit any content without prior written permission from us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                3. Product Information & Pricing
              </h2>
              <p className="text-sm opacity-80 mb-6">We strive to ensure that all product descriptions, images, colors, and pricing displayed on our website are accurate and up to date. However:</p>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Actual product colors may vary slightly depending on your screen or device settings.</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Minor variations in measurements and appearance may occur.</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Product availability, descriptions, and pricing are subject to change without prior notice.</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> We reserve the right to modify, discontinue, or update products and Services at any time without liability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                4. Orders & Billing Information
              </h2>
              <p className="text-sm opacity-80 mb-6">We reserve the right to refuse, cancel, or limit any order placed through our website at our sole discretion. This may include limitations on orders placed:</p>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Under the same customer account</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Using the same payment method</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> With the same billing or shipping address</li>
              </ul>
              <p className="text-sm opacity-80">
                You agree to provide accurate, current, and complete billing, shipping, and contact information for all purchases. Failure to provide accurate information may result in order cancellation or delivery issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                5. Shipping & Delivery
              </h2>
              <p className="text-sm opacity-80 mb-6">
                Delivery timelines provided on the website are estimated and may vary depending on location, courier availability, and unforeseen circumstances. EVO Carlton Trends shall not be held responsible for delays caused by:
              </p>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Courier or logistics partners</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Natural events or public disruptions</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Incorrect shipping information provided by customers</li>
              </ul>
              <p className="text-sm opacity-80">Risk of loss and ownership of products passes to you upon successful delivery.</p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                6. Disclaimer of Warranties
              </h2>
              <p className="text-sm opacity-80 mb-6">Our Services and products are provided on an “as is” and “as available” basis without warranties of any kind, either express or implied. We do not guarantee that:</p>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> The website will operate uninterrupted or error-free</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Product descriptions or content will always be completely accurate</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Services will be secure or free from technical issues</li>
              </ul>
              <p className="text-sm opacity-80">Your use of the Services is at your sole risk.</p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-sm opacity-80 mb-6">
                To the fullest extent permitted by law, EVO Carlton Trends, including its owners, employees, affiliates, partners, suppliers, and service providers, shall not be liable for any:
              </p>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Direct or indirect damages</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Loss of profits or revenue</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Data loss</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Business interruption</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Special, incidental, or consequential damages</li>
              </ul>
              <p className="text-sm opacity-80">arising from your use of our website, products, or Services.</p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                8. Indemnification
              </h2>
              <p className="text-sm opacity-80 mb-6">
                You agree to indemnify, defend, and hold harmless EVO Carlton Trends and its affiliates, employees, partners, and service providers from any claims, liabilities, damages, losses, or legal expenses arising from:
              </p>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Your violation of these Terms</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Misuse of our Services</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Violation of any applicable laws or third-party rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                9. Governing Law
              </h2>
              <p className="text-sm opacity-80">
                These Terms and any disputes arising out of your use of our Services shall be governed and interpreted in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                10. Changes to Terms
              </h2>
              <p className="text-sm opacity-80">
                We reserve the right to update, modify, or replace any part of these Terms at any time without prior notice. Changes will become effective immediately upon posting on this page. Continued use of our Services after changes constitutes acceptance of those updates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                11. Discount Coupons & Promotional Offers
              </h2>
              <p className="text-sm opacity-80 mb-8">
                At EVO Carlton Trends, we may occasionally provide promotional offers, discount coupons, limited-time deals, or special campaign pricing. By using these offers, you agree to the following terms:
              </p>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">Coupon & Offer Usage</h3>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Discount coupons and promotional offers are valid only for the specified duration mentioned in the campaign.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Coupons may be applicable only on selected products, categories, or minimum order values.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Only one coupon or promotional code can be used per order unless otherwise stated.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Coupons cannot be exchanged for cash, credit, or refunds.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Offers are subject to stock availability and may be withdrawn or modified without prior notice.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">Restrictions</h3>
                  <p className="text-sm opacity-80 mb-4">We reserve the right to refuse or cancel any order where:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-4">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> A coupon has been used improperly or fraudulently</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Multiple accounts are created to misuse promotional offers</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Bulk orders are placed solely to exploit discounts</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Technical errors result in incorrect pricing or discounts</li>
                  </ul>
                  <p className="text-sm opacity-80">In such cases, EVO Carlton Trends may cancel the order without prior notice and refund the paid amount if applicable.</p>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">Non-Transferable Offers</h3>
                  <p className="text-sm opacity-80">All promotional offers, wallet credits, and coupon codes are non-transferable and intended for individual customer use only.</p>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">Expired Coupons</h3>
                  <p className="text-sm opacity-80">Expired coupons or promotional codes cannot be reactivated, extended, or redeemed after their validity period ends.</p>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">Returns & Replacements on Discounted Orders</h3>
                  <p className="text-sm opacity-80">Products purchased during sales or promotional offers remain eligible only for replacement according to our Replacement Policy. Refunds will not be provided under any circumstances.</p>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">Right to Modify Offers</h3>
                  <p className="text-sm opacity-80">EVO Carlton Trends reserves the right to modify, suspend, or terminate any promotional campaign, discount offer, or coupon program at its sole discretion without prior notice.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                12. Replacement Policy
              </h2>
              <p className="text-white tracking-[0.15em] uppercase text-sm mb-6">No Refund Policy — Replacement Only</p>
              <p className="text-sm opacity-80 mb-8">At EVO Carlton Trends, we currently do not offer refunds, cancellations, or store credits. We only provide product replacements under eligible conditions mentioned below.</p>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">12.1. Eligibility for Replacement</h3>
                  <p className="text-sm opacity-80 mb-4">Replacement requests are accepted only in the following situations:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-8">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> You received a defective or damaged product</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> You received the wrong product</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> You require a size replacement (subject to availability)</li>
                  </ul>
                  
                  <p className="text-sm opacity-80 mb-4">To qualify for a replacement:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-8">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> The request must be made within 7 days of product delivery</li>
                    <li className="flex items-baseline gap-3">
                      <div className="w-1 h-1 bg-white/50 shrink-0 mt-1.5"/> 
                      <div>
                        The product must be:
                        <ul className="mt-3 space-y-2 pl-4 list-disc marker:text-white/30">
                          <li>Unused</li>
                          <li>Unwashed</li>
                          <li>In original condition</li>
                          <li>With all tags and packaging intact</li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                  
                  <p className="text-sm opacity-80 mb-4">The following items are not eligible for replacement:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Gift cards</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Promotional/free products</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Customized products (if applicable)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">12.2. Replacement Request Process</h3>
                  <p className="text-sm opacity-80 mb-4">To request a replacement, please email us at: <span className="text-white">customercare@evocarltontrends.com</span></p>
                  <p className="text-sm opacity-80 mb-4">Include the following details:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Order ID</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Reason for replacement</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Clear images or videos showing the issue</li>
                  </ul>
                  <p className="text-sm opacity-80 mb-4">Our team will review your request and respond with further instructions. Once approved:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> The replacement process may take 7–10 business days</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Processing is subject to product availability</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">12.3. Important Notes</h3>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> We do not provide refunds or cash returns</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Only one replacement request is allowed per order</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Minor color variations due to lighting or screen settings are not considered defects</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Size measurements may vary slightly by 1–2 cm</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Replacement requests without proper proof may be declined</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                13. Referral Program
              </h2>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">13.1. Referral Program Eligibility</h3>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Any customer or individual may enroll in the EVO Carlton Trends Referral Program.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Upon successful enrollment, participants will receive a unique referral coupon code linked to their registered email address.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> The referral code may be shared with friends, family, or other customers for purchases made on the EVO Carlton Trends website.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">13.2. Referral Benefits</h3>
                  <p className="text-sm opacity-80 mb-4">When a new or existing customer places an order using a valid referral coupon code:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> The referred customer will receive a 10% discount on their purchase.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> The referral code owner will become eligible for a 10% referral reward or benefit, subject to the terms mentioned below.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> The referral reward structure may be updated, modified, or revised by EVO Carlton Trends at any time without prior notice.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">13.3. Referral Reward Approval Period</h3>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Referral rewards will only be processed after the successful completion of the applicable 7-day replacement/return eligibility period from the date of product delivery.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Rewards will not be credited immediately after purchase confirmation.</li>
                  </ul>
                  <p className="text-sm opacity-80 mb-4 font-medium text-white">Non-Eligible Orders</p>
                  <p className="text-sm opacity-80 mb-4">The following orders will not qualify for referral rewards:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Cancelled orders</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Returned orders</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Refunded orders</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Replacement orders</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Fraudulent or suspicious transactions</li>
                  </ul>
                  <p className="text-sm opacity-80">EVO Carlton Trends reserves the right to reject referral benefits if misuse or policy violations are detected.</p>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">13.4. Coupon Usage Limit And Validity</h3>
                  <p className="text-sm opacity-80 mb-4 font-medium text-white">Usage:</p>
                  <p className="text-sm opacity-80 mb-4">Each referral coupon code is valid for:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> One-time use only per customer</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Multiple uses by the same customer using the same referral code are not permitted</li>
                  </ul>
                  <p className="text-sm opacity-80 mb-6">EVO Carlton Trends reserves the right to cancel orders or revoke benefits in cases of duplicate, fraudulent, or unauthorized usage.</p>

                  <p className="text-sm opacity-80 mb-4 font-medium text-white">Referral Coupon Validity:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> <span className="text-white">For Referred Customers:</span> Customers using the referral code for purchases may use the coupon during its active promotional period, subject to availability and campaign validity.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> <span className="text-white">For Referral Code Owners:</span> The referral coupon assigned to the owner will remain active for one (1) month from the date of issuance or activation.</li>
                  </ul>
                  <p className="text-sm opacity-80 mb-4">After the validity period expires:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> The coupon code may become inactive</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Referral rewards and associated benefits may be paused until renewal</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">13.5. Coupon Renewal</h3>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Referral code owners may request renewal of their coupon code validity by contacting the EVO Carlton Trends support team.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Approval of renewal requests, reward percentages, benefits, or additional incentives will be determined solely by the EVO Carlton Trends team and communicated accordingly.</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> EVO Carlton Trends reserves the right to approve, reject, modify, or discontinue any referral code renewal request at its discretion.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">13.6. Referral Reward Distribution</h3>
                  <p className="text-sm opacity-80 mb-4">Referral rewards may be provided in the form of:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Discount coupons</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Store benefits</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Promotional rewards</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Exclusive offers</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Other benefits decided by EVO Carlton Trends</li>
                  </ul>
                  <p className="text-sm opacity-80">Reward types, percentages, and redemption conditions are subject to change without prior notice.</p>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">13.7. Misuse & Fraud Prevention</h3>
                  <p className="text-sm opacity-80 mb-4">Any misuse of the referral program, including but not limited to:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Fake referrals</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Self-referrals using multiple accounts</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Unauthorized sharing methods</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Fraudulent transactions</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Manipulation of orders</li>
                  </ul>
                  <p className="text-sm opacity-80 mb-4">may result in:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Immediate disqualification from the referral program</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Cancellation of rewards</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Suspension of accounts or coupon codes</li>
                  </ul>
                  <p className="text-sm opacity-80">EVO Carlton Trends reserves the final right to determine referral program abuse.</p>
                </div>

                <div>
                  <h3 className="text-white tracking-[0.15em] uppercase text-sm mb-4">13.8. Program Modification or Termination</h3>
                  <p className="text-sm opacity-80 mb-4">EVO Carlton Trends reserves the right to:</p>
                  <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Modify the referral program structure</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Change reward percentages</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Update eligibility criteria</li>
                    <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Suspend or terminate the program</li>
                  </ul>
                  <p className="text-sm opacity-80">at any time without prior notice. Participation in the referral program constitutes acceptance of all current and future program terms.</p>
                </div>
              </div>
            </section>

            <section className="pt-16 border-t border-white/10">
              <h2 className="text-2xl text-white tracking-[0.15em] mb-10 uppercase">14. Contact Information</h2>
              <div className="bg-white/5 p-8 rounded-xl border border-white/5 space-y-6">
                <div>
                  <p className="text-xs text-white/40 tracking-widest uppercase mb-1">Email</p>
                  <p className="text-sm">customercare@evocarltontrends.com</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 tracking-widest uppercase mb-1">Brand</p>
                  <p className="text-sm">EVO Carlton Trends</p>
                  <p className="text-xs text-white/60 italic mt-2">Driven by Evolution, Defined by Class</p>
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
