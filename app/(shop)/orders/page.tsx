"use client";

import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { getMyOrders } from "@/lib/api/order";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size: string;
  color: string;
}

interface Order {
  _id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isLoggedIn()) {
        router.replace("/login");
    } else if (mounted) {
        fetchOrders();
    }
  }, [mounted, isLoggedIn]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res: any = await getMyOrders();
      setOrders(res.data || res || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isLoggedIn()) return <div className="min-h-screen bg-[#f5f5f5]" />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "text-amber-600 bg-amber-50 border-amber-100";
      case "Shipped": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Delivered": return "text-green-600 bg-green-50 border-green-100";
      case "Cancelled": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing": return <Clock size={12} />;
      case "Shipped": return <Package size={12} />;
      case "Delivered": return <CheckCircle2 size={12} />;
      case "Cancelled": return <AlertCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-500 hover:text-black">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Order History</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-8 space-y-8">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-gray-300" size={32} />
                <p className="text-xs text-gray-400 font-medium italic">Retrieving your orders...</p>
           </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here.</p>
            <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-gray-200 transition-all">
                {/* Order Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Order {order.order_number}</p>
                    <p className="text-sm font-medium text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-widest uppercase ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-6 flex gap-6">
                      <div className="w-20 h-24 bg-[#f8f8f8] rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-bold tracking-wide text-gray-900 underline decoration-gray-100 underline-offset-4">{item.name}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{item.size} • {item.color}</p>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-sm font-semibold">₹{item.price.toLocaleString("en-IN")}</p>
                          <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white flex items-center justify-between border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">₹{order.total_amount.toLocaleString("en-IN")}</p>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-red-600 hover:text-red-700 uppercase transition-all">
                    Track Order <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
