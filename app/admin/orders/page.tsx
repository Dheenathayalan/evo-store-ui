"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllOrdersAdmin, updateOrderStatus } from "@/lib/api/order";
import { toast } from "@/store/toast";
import { Package, Clock, CheckCircle, AlertCircle, ChevronLeft, Truck } from "lucide-react";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const statuses = ["Processing", "Shipped", "Delivered", "Canceled"];

  const fetchOrders = async () => {
    try {
      const res: any = await getAllOrdersAdmin();
      setOrders(res.data ?? res);
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success("Status updated");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing": return <Clock size={14} className="text-blue-500" />;
      case "shipped": return <Truck size={14} className="text-purple-500" />;
      case "delivered": return <CheckCircle size={14} className="text-green-500" />;
      case "canceled": return <AlertCircle size={14} className="text-red-500" />;
      default: return <Package size={14} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing": return "bg-blue-50 text-blue-600";
      case "shipped": return "bg-purple-50 text-purple-600";
      case "delivered": return "bg-green-50 text-green-600";
      case "canceled": return "bg-red-50 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      {/* Header */}
      <div className="bg-black text-white px-8 py-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white transition group mb-4"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" />
          <span className="text-xs tracking-[4px] uppercase">Back to Profile</span>
        </button>
        <h1 className="text-3xl font-semibold tracking-tight">Received Orders</h1>
        <p className="text-white/50 text-sm mt-2">Manage and track all customer orders</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
             <Package size={48} className="mx-auto text-gray-200 mb-4" />
             <p className="text-gray-500">No orders received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Package size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold tracking-tight">{order.order_number}</p>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                        {updating === order._id && (
                          <span className="text-[10px] text-gray-400 animate-pulse lowercase font-medium">Saving...</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {order.user_email} • {new Date(order.created_at).toLocaleString("en-IN", { 
                          month: "short", 
                          day: "numeric", 
                          year: "numeric", 
                          hour: "numeric", 
                          minute: "2-digit",
                          hour12: true 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Update Status</p>
                      <select 
                        value={order.status}
                        disabled={updating === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-black transition bg-white"
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="text-right border-l pl-6 border-gray-100">
                      <p className="text-lg font-bold">₹{order.total_amount.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{order.items.length} Items</p>
                    </div>
                  </div>
                </div>
                
                {/* Expandable items preview */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                    {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="px-3 py-1 bg-gray-50 rounded-md text-[10px] text-gray-400 flex gap-2 border border-transparent hover:border-gray-200 transition">
                           <span className="font-bold text-gray-700">{item.qty}x</span>
                           <span className="truncate max-w-[150px]">{item.title}</span>
                           <span className="text-gray-200">•</span>
                           <span>{item.color} / {item.size}</span>
                        </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
