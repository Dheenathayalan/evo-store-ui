"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsersAdmin } from "@/lib/api/user";
import { Users, ChevronLeft, ShieldCheck, Mail, Calendar } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res: any = await getAllUsersAdmin();
        setUsers(res.data ?? res);
      } catch (err) {
        console.error("Failed to fetch admin users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
        <h1 className="text-3xl font-semibold tracking-tight">Active User Accounts</h1>
        <p className="text-white/50 text-sm mt-2">Manage all registered customer accounts</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
             <Users size={48} className="mx-auto text-gray-200 mb-4" />
             <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div key={user.email} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold">
                  {user.first_name?.[0].toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        {user.first_name} {user.last_name}
                        {user.is_admin && (
                            <span title="Administrator">
                                <ShieldCheck size={16} className="text-red-500" aria-label="Administrator" />
                            </span>
                        )}
                    </h3>
                    <div className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${user.is_active ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={12} />
                        {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={12} />
                        Joined {new Date(user.created_at || new Date()).toLocaleString("en-IN", { month: "long", year: "numeric" })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
