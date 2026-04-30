"use client";

import { useToast } from "@/store/toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            layout
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md
              ${toast.type === "success" ? "bg-white/90 border-green-100" : ""}
              ${toast.type === "error" ? "bg-white/90 border-red-100" : ""}
              ${toast.type === "info" ? "bg-white/90 border-[#cbcbcb]" : ""}
            `}
          >
            <div className={`mt-0.5 ${
              toast.type === "success" ? "text-green-500" : 
              toast.type === "error" ? "text-red-500" : 
              "text-black"
            }`}>
              {toast.type === "success" && <CheckCircle size={18} />}
              {toast.type === "error" && <XCircle size={18} />}
              {toast.type === "info" && <Info size={18} />}
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5 flex items-center justify-between">
                {toast.type}
                <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-black">
                  <X size={14} />
                </button>
              </p>
              <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                {toast.message}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
