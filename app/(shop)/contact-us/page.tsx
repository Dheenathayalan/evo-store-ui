"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Clock, Send } from "lucide-react";

export default function ContactUsPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for form submission would go here
    alert("Thank you for reaching out. Our team will get back to you within 24–48 hours.");
  };

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl sm:text-6xl font-light tracking-[0.4em] mb-6 uppercase">
            CONTACT US
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            We’d love to hear from you
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-16"
          >
            <div className="space-y-6">
              <h2 className="text-2xl font-light tracking-widest uppercase">Get In Touch</h2>
              <p className="text-gray-500 text-sm leading-relaxed tracking-wide font-light max-w-md">
                For any queries, support, or feedback, our team is here to assist you. 
                We aim to respond to all inquiries within 24–48 hours.
              </p>
            </div>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="bg-white/5 p-4 rounded-full text-white/40">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-1">Email</p>
                  <p className="text-sm tracking-wide">customercaret@evocarltontrends.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white/5 p-4 rounded-full text-white/40">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-1">Phone</p>
                  <p className="text-sm tracking-wide">+91 6282 036 765</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white/5 p-4 rounded-full text-white/40">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-1">Working Hours</p>
                  <p className="text-sm tracking-wide">Monday to Saturday, 9 AM – 6 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 p-10 sm:p-16 border border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition-colors text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition-colors text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Subject</label>
                <input 
                  required 
                  type="text" 
                  className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition-colors text-sm"
                  placeholder="Order Inquiry"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Message</label>
                <textarea 
                  required 
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition-colors text-sm resize-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-white text-black py-5 text-xs tracking-[0.3em] font-medium hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-3 uppercase"
              >
                Send Message <Send size={14} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Closing Note */}
        <div className="mt-32 text-center">
            <p className="text-[10px] text-white/10 tracking-[0.5em] uppercase">
              EVO CARLTON TRENDS • CONNECT WITH US
            </p>
        </div>
      </div>
    </div>
  );
}
