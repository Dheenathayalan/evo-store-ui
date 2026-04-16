"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How long does delivery take?",
    answer: "Orders are typically delivered within 5–10 business days depending on your location. We strive to process and dispatch all orders within 24-48 hours."
  },
  {
    question: "Can I return a product?",
    answer: "Yes, we accept returns within 7 days of delivery, provided the item is unused, unwashed, and in its original condition with all tags intact. Please visit our Returns page for more details."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a tracking link via email or SMS. You can also track your order status directly from your profile dashboard under 'Orders'."
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer: "Yes, Cash on Delivery (COD) is available on selected orders and locations. You will see the COD option during checkout if it is available for your pin code."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our dedicated support team through our 'Contact Us' page or by emailing support@evocarltontrends.com. We typically respond within 24 hours."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.3em] mb-4 text-center">
            FAQS
          </h1>
          <p className="text-gray-500 text-sm tracking-[0.2em] mb-20 text-center uppercase">
            Frequently Asked Questions
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-white/10 overflow-hidden bg-white/5 transition-all duration-300 hover:bg-white/10"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left group"
                >
                  <span className="text-sm sm:text-base tracking-[0.1em] font-light uppercase">
                    {faq.question}
                  </span>
                  <div className="shrink-0 ml-4 transition-transform duration-300">
                    {openIndex === index ? (
                      <Minus size={18} className="text-white/40" />
                    ) : (
                      <Plus size={18} className="text-white/40 group-hover:text-white" />
                    )}
                  </div>
                </button>
                
                <div 
                  className={`px-6 sm:px-8 overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-40 pb-8" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-gray-400 leading-relaxed font-light tracking-wide">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 pt-16 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm tracking-widest mb-6 uppercase">
              Don't find what you're looking for?
            </p>
            <a 
              href="/contact-us" 
              className="inline-block border border-white px-10 py-4 text-xs tracking-[0.3em] hover:bg-white hover:text-black transition duration-300"
            >
              CONTACT SUPPORT
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
