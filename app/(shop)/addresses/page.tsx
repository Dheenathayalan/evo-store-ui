"use client";

import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Plus, 
  MapPin, 
  ChevronLeft, 
  MoreVertical, 
  Home, 
  Briefcase, 
  Trash2,
  Edit2,
  Loader2
} from "lucide-react";
import { getMyProfile, addAddress, deleteAddress, updateAddress } from "@/lib/api/user";

interface Address {
  id: string;
  type: string;
  name: string;
  phone: string;
  address_line: string;
  landmark: string;
  city: string;
  state: string;
  pin_code: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address_line: "",
    landmark: "",
    city: "",
    state: "",
    pin_code: "",
    type: "Home",
    is_default: false
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isLoggedIn()) {
        router.replace("/login");
    } else if (mounted) {
        fetchAddresses();
    }
  }, [mounted, isLoggedIn]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res: any = await getMyProfile();
      setAddresses(res.data?.addresses || res.addresses || []);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", phone: "", address_line: "", landmark: "",
      city: "", state: "", pin_code: "", type: "Home", is_default: false
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      name: addr.name,
      phone: addr.phone,
      address_line: addr.address_line,
      landmark: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      pin_code: addr.pin_code,
      type: addr.type,
      is_default: addr.is_default
    });
    setShowAddForm(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await addAddress(formData);
      }
      await fetchAddresses();
      resetForm();
    } catch (err) {
      alert("Failed to save address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  const handleSetDefault = async (addr: Address) => {
    try {
      await updateAddress(addr.id, { ...addr, is_default: true });
      await fetchAddresses();
    } catch (err) {
      alert("Failed to set default address");
    }
  };

  if (!mounted || !isLoggedIn()) return <div className="min-h-screen bg-[#f5f5f5]" />;

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-500 hover:text-black transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Shipping Addresses</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-8 space-y-6">
        {/* Add Button */}
        <button 
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="w-full h-16 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-3 text-red-600 font-bold tracking-widest hover:border-red-200 hover:bg-red-50/50 transition-all duration-300 group"
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          ADD NEW ADDRESS
        </button>

        {/* Saved Addresses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              {addresses.length} SAVED ADDRESSES
            </p>
          </div>
          
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-gray-300" size={32} />
                <p className="text-xs text-gray-400 font-medium italic">Loading your addresses...</p>
             </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 italic text-gray-400 text-sm">
                No addresses found. Add one to get started.
            </div>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-gray-200 transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                        {addr.type === "Home" ? <Home size={14} /> : <Briefcase size={14} />}
                      </div>
                      <span className="text-[10px] tracking-widest font-bold uppercase text-gray-500">{addr.type}</span>
                      {addr.is_default && (
                        <span className="text-[9px] bg-black text-white font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Default</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{addr.name}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {addr.address_line}{addr.landmark ? `, ${addr.landmark}` : ""}<br />
                      {addr.city}, {addr.state} - <span className="font-bold text-gray-800">{addr.pin_code}</span>
                    </p>
                    <p className="text-sm text-gray-500 pt-2 flex items-center gap-2">
                      <span className="text-gray-400 italic">Phone:</span> {addr.phone}
                    </p>
                  </div>
                </div>

                {/* Action Tabs */}
                <div className="flex border-t divide-x">
                  {!addr.is_default && (
                    <button 
                        onClick={() => handleSetDefault(addr)}
                        className="flex-1 py-4 text-[10px] font-bold text-gray-400 hover:text-black hover:bg-gray-50 transition uppercase tracking-widest"
                    >
                        Make Default
                    </button>
                  )}
                  <button 
                    onClick={() => handleEdit(addr)}
                    className="flex-1 py-4 text-[10px] font-bold text-gray-400 hover:text-black hover:bg-gray-50 transition flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="flex-1 py-4 text-[10px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Form Drawer */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col"
          >
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                    {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">Delivery details</p>
              </div>
              <button onClick={resetForm} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">✕</button>
            </div>

            <form onSubmit={handleSaveAddress} id="addr-form" className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] tracking-widest font-bold text-gray-400 uppercase border-l-2 border-red-500 pl-3">Contact Details</p>
                <div className="grid gap-4">
                    <input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Full Name *" 
                        className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium" 
                        required 
                    />
                    <input 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="Mobile Number *" 
                        className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium" 
                        required 
                    />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] tracking-widest font-bold text-gray-400 uppercase border-l-2 border-red-500 pl-3">Address Info</p>
                <div className="grid gap-4">
                    <input 
                        value={formData.pin_code}
                        onChange={e => setFormData({...formData, pin_code: e.target.value})}
                        placeholder="Pin Code *" 
                        className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium" 
                        required 
                    />
                    <input 
                        value={formData.address_line}
                        onChange={e => setFormData({...formData, address_line: e.target.value})}
                        placeholder="Address (House No, Building, Street) *" 
                        className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium" 
                        required 
                    />
                    <input 
                        value={formData.landmark}
                        onChange={e => setFormData({...formData, landmark: e.target.value})}
                        placeholder="Landmark (Optional)" 
                        className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium" 
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                            placeholder="City *" 
                            className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium" 
                            required 
                        />
                        <input 
                            value={formData.state}
                            onChange={e => setFormData({...formData, state: e.target.value})}
                            placeholder="State *" 
                            className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium" 
                            required 
                        />
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] tracking-widest font-bold text-gray-400 uppercase border-l-2 border-red-500 pl-3">Save As</p>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: "Home"})}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                        formData.type === "Home" ? "bg-black text-white shadow-lg" : "bg-gray-50 text-gray-400 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    <Home size={14} /> Home
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: "Work"})}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                        formData.type === "Work" ? "bg-black text-white shadow-lg" : "bg-gray-50 text-gray-400 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    <Briefcase size={14} /> Work
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                    type="checkbox" 
                    id="is_default"
                    checked={formData.is_default}
                    onChange={e => setFormData({...formData, is_default: e.target.checked})}
                    className="accent-black w-4 h-4" 
                />
                <label htmlFor="is_default" className="text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer">Set as default address</label>
              </div>
            </form>

            <div className="p-8 border-t bg-white">
              <button 
                type="submit"
                form="addr-form"
                disabled={submitting}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-bold tracking-widest uppercase hover:bg-red-700 transition-all shadow-xl shadow-red-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
              >
                {submitting && <Loader2 className="animate-spin" size={18} />}
                {submitting ? "SAVING..." : (editingAddress ? "UPDATE ADDRESS" : "SAVE ADDRESS")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
