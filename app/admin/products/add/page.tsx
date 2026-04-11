"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { createProduct } from "@/lib/api/products";

/* ------------------ SCHEMA ------------------ */
const schema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  brand: z.string().min(1, "Select a brand"),
  category: z.string().min(1, "Select a category"),
  description: z.string().min(5, "Description required"),
  base_price: z
    .string()
    .min(1, "Price required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
});

const brands = ["YourBrand", "Nike", "Adidas"];
const categories = ["tops", "bottoms", "accessories"];
const sizesList = ["S", "M", "L", "XL"];

/* ------------------ PAGE ------------------ */
export default function AddProductPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  const [colorInput, setColorInput] = useState({
    name: "",
    value: "#000000",
  });

  const [images, setImages] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  /* ------------------ SIZE ------------------ */
  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  /* ------------------ COLOR ------------------ */
  const addColor = () => {
    if (!colorInput.name) return;

    setColors((prev) => [...prev, colorInput]);
    setColorInput({ name: "", value: "#000000" });
  };

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  /* ------------------ IMAGE ------------------ */
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleThumbnailUpload = (file: File | null) => {
    if (!file) return;
    setThumbnail(URL.createObjectURL(file));
  };

  /* ------------------ VARIANTS ------------------ */
  useEffect(() => {
    if (sizes.length === 0 || colors.length === 0) {
      setVariants([]);
      return;
    }

    const newVariants: any[] = [];

    sizes.forEach((size) => {
      colors.forEach((color) => {
        const existing = variants.find(
          (v) => v.size === size && v.color === color.name,
        );

        newVariants.push({
          size,
          color: color.name,
          stock: existing?.stock || 0,
          price: existing?.price || 0,
        });
      });
    });

    setVariants(newVariants);
  }, [sizes, colors]);

  const updateVariant = (
    index: number,
    key: "stock" | "price",
    value: number,
  ) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  /* ------------------ SUBMIT ------------------ */
  const onSubmit = async (data: any) => {
    try {
      if (variants.length === 0) {
        alert("Please select sizes & colors");
        return;
      }
      const payload = {
        title: data.title,
        slug: data.slug,
        brand: data.brand,
        category: data.category,
        description: data.description,
        base_price: Number(data.base_price),

        attributes: {
          colors: colors.map((c) => ({
            name: c.name,
            value: c.value,
          })),
          sizes,
        },

        variants: variants.map((v) => ({
          color: v.color,
          size: v.size,
          price: Number(v.price),
          stock: Number(v.stock),
        })),
      };

      console.log("FINAL API PAYLOAD", payload);

      const res = await createProduct(payload);

      console.log("SUCCESS", res);

      alert("Product created successfully 🚀");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-[#f6f6f6] p-10">
      <div className="max-w-6xl mx-auto bg-white p-10 shadow-sm rounded">
        <h1 className="text-2xl font-semibold mb-8">Add Product</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
          className="grid md:grid-cols-2 gap-10"
        >
          {/* LEFT */}
          <div className="space-y-6">
            <Input label="Title" error={errors.title?.message}>
              <input {...register("title")} className="input" />
            </Input>

            <Input label="Slug" error={errors.slug?.message}>
              <input {...register("slug")} className="input" />
            </Input>

            <Input label="Brand" error={errors.brand?.message}>
              <select {...register("brand")} className="input">
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Input>

            <Input label="Category" error={errors.category?.message}>
              <select {...register("category")} className="input">
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Input>

            <Input label="Price" error={errors.base_price?.message}>
              <input
                type="number"
                {...register("base_price")}
                className="input"
              />
            </Input>

            <Input label="Description" error={errors.description?.message}>
              <textarea {...register("description")} className="input h-32" />
            </Input>

            {/* Sizes */}
            <div>
              <p className="label">Sizes</p>
              <div className="flex gap-2 flex-wrap">
                {sizesList.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`chip ${sizes.includes(s) ? "active" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Images */}
            <div>
              <p className="label">Product Images</p>

              <div className="upload-box">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
                <p>Drag & drop or click</p>
              </div>

              <div className="flex gap-3 mt-3 flex-wrap">
                {images.map((img, i) => (
                  <img key={i} src={img} className="preview-img" />
                ))}
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <p className="label">Landing Thumbnail</p>

              <div className="upload-box">
                <input
                  type="file"
                  onChange={(e) =>
                    handleThumbnailUpload(e.target.files?.[0] || null)
                  }
                />
                <p>Upload thumbnail</p>
              </div>

              {thumbnail && (
                <img src={thumbnail} className="preview-img mt-3" />
              )}
            </div>

            {/* COLORS */}
            <div>
              <p className="label">Colors</p>

              <div className="flex gap-3 mb-3">
                <input
                  placeholder="Color Name"
                  className="input"
                  value={colorInput.name}
                  onChange={(e) =>
                    setColorInput({ ...colorInput, name: e.target.value })
                  }
                />

                <input
                  type="color"
                  className="w-14 h-12 border"
                  value={colorInput.value}
                  onChange={(e) =>
                    setColorInput({ ...colorInput, value: e.target.value })
                  }
                />

                <button type="button" onClick={addColor} className="btn">
                  Add
                </button>
              </div>

              <div className="flex gap-3 flex-wrap">
                {colors.map((c, i) => (
                  <div key={i} className="chip flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: c.value }}
                    />
                    {c.name}
                    <button type="button" onClick={() => removeColor(i)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* VARIANTS */}
          {variants.length > 0 && (
            <div className="col-span-2">
              <p className="label mb-4">Variants</p>

              <div className="border rounded overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-100 px-4 py-3 text-sm font-medium">
                  <span>Size</span>
                  <span>Color</span>
                  <span>Stock</span>
                  <span>Price</span>
                </div>

                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-4 px-4 py-3 border-t">
                    <span>{v.size}</span>
                    <span>{v.color}</span>

                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) =>
                        updateVariant(i, "stock", Number(e.target.value))
                      }
                      className="input"
                    />

                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) =>
                        updateVariant(i, "price", Number(e.target.value))
                      }
                      className="input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <div className="col-span-2">
            <button type="submit" onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }} className="btn-primary">Save Product</button>
          </div>
        </form>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          padding: 10px;
          outline: none;
        }
        .label {
          font-size: 12px;
          margin-bottom: 6px;
        }
        .chip {
          border: 1px solid #ccc;
          padding: 6px 10px;
          cursor: pointer;
        }
        .chip.active {
          background: black;
          color: white;
        }
        .upload-box {
          border: 2px dashed #ccc;
          padding: 20px;
          text-align: center;
        }
        .preview-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
        }
        .btn {
          background: black;
          color: white;
          padding: 10px 16px;
        }
        .btn-primary {
          background: black;
          color: white;
          padding: 12px 20px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}

/* ------------------ INPUT ------------------ */
function Input({ label, children, error }: any) {
  return (
    <div>
      <p className="label">{label}</p>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
