"use client";

import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api/categories";
import { toast } from "@/store/toast";
import { Plus, X, Pencil, Trash } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [subInput, setSubInput] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res: any = await getCategories();
      setCategories(res.data ?? res);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = () => {
    if (!subInput.trim()) return;
    if (subcategories.includes(subInput.trim())) {
      toast.error("Subcategory already exists");
      return;
    }
    setSubcategories([...subcategories, subInput.trim()]);
    setSubInput("");
  };

  const handleRemoveSubcategory = (sub: string) => {
    setSubcategories(subcategories.filter((s) => s !== sub));
  };

  const resetForm = () => {
    setName("");
    setSubcategories([]);
    setSubInput("");
    setIsEditing(null);
  };

  const handleEdit = (cat: any) => {
    setIsEditing(cat._id);
    setName(cat.name);
    setSubcategories(cat.subcategories || []);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      subcategories,
    };

    try {
      if (isEditing) {
        await updateCategory(isEditing, payload);
        toast.success("Category updated");
      } else {
        await createCategory(payload);
        toast.success("Category created");
      }
      resetForm();
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Manage Categories</h1>

        {/* Form Card */}
        <div className="bg-white p-6 shadow-sm rounded border">
          <h2 className="text-lg font-medium mb-4">{isEditing ? "Edit Category" : "Add New Category"}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1 block">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. T-Shirts"
                className="w-full border p-2.5 rounded text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1 block">
                Subcategories (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subInput}
                  onChange={(e) => setSubInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubcategory()}
                  placeholder="e.g. Graphic Tees"
                  className="flex-1 border p-2.5 rounded text-sm outline-none focus:border-black"
                />
                <button
                  onClick={handleAddSubcategory}
                  className="bg-black text-white px-4 rounded hover:bg-black/90 flex items-center gap-1 text-sm font-medium"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {subcategories.map((sub) => (
                  <div key={sub} className="flex items-center gap-2 bg-gray-100 border px-3 py-1.5 rounded-full text-sm">
                    {sub}
                    <button onClick={() => handleRemoveSubcategory(sub)} className="text-gray-500 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={handleSave}
                className="bg-black text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-black/90 transition"
              >
                {isEditing ? "Update Category" : "Save Category"}
              </button>
              {isEditing && (
                <button
                  onClick={resetForm}
                  className="bg-gray-200 text-black px-6 py-2.5 rounded text-sm font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List Card */}
        <div className="bg-white p-6 shadow-sm rounded border">
          <h2 className="text-lg font-medium mb-4">Existing Categories</h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-100 rounded w-full"></div>
              <div className="h-12 bg-gray-100 rounded w-full"></div>
              <div className="h-12 bg-gray-100 rounded w-full"></div>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories found.</p>
          ) : (
            <div className="divide-y border rounded">
              {categories.map((cat) => (
                <div key={cat._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div>
                    <h3 className="font-medium">{cat.name}</h3>
                    {cat.subcategories?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Subcategories: {cat.subcategories.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded transition"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
