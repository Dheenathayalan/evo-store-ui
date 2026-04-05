"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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

export default function AddProductPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [colorInput, setColorInput] = useState({
    name: "",
    value: "#000000",
  });

  const [images, setImages] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  /* ------------------ HANDLERS ------------------ */

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

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

  const addColor = () => {
    if (!colorInput.name) return;

    setColors((prev) => [...prev, colorInput]);
    setColorInput({ name: "", value: "#000000" });
  };

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      base_price: Number(data.base_price),
      sizes,
      colors,
      images,
      thumbnail,
    };

    console.log("FINAL PAYLOAD", payload);
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-10">
      <div className="max-w-6xl mx-auto bg-white p-10 shadow-sm">
        <h1 className="text-2xl font-semibold mb-8">Add Product</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
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
                    setColorInput({
                      ...colorInput,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="color"
                  className="w-14 h-12 border"
                  value={colorInput.value}
                  onChange={(e) =>
                    setColorInput({
                      ...colorInput,
                      value: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  onClick={addColor}
                  className="bg-black text-white px-4"
                >
                  Add
                </button>
              </div>

              <div className="flex gap-3 flex-wrap">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 border px-3 py-1"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: c.value }}
                    />
                    <span>{c.name}</span>

                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="col-span-2">
            <button className="bg-black text-white px-8 py-3">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------ COMPONENT ------------------ */

function Input({ label, children, error }: any) {
  return (
    <div>
      <p className="label">{label}</p>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
