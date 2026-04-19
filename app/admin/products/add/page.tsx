"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createProduct, updateProduct, getProductBySlug } from "@/lib/api/products";
import { getPresignedUrl, uploadFileToS3 } from "@/lib/api/upload";
import { useAuth } from "@/store/auth";

export const dynamic = 'force-dynamic';

/* ------------------ SCHEMA ------------------ */
const schema = z.object({
  title: z.string().min(2, "Title is required"),
  brand: z.string().min(1, "Select a brand"),
  category: z.string().min(1, "Select a category"),
  description: z.string().min(5, "Description required"),
  base_price: z
    .string()
    .min(1, "Price required")
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" }),
  showInLanding: z.boolean().optional(),
});

const brands = ["YourBrand", "Nike", "Adidas"];
const categories = ["tops", "bottoms", "accessories"];
const sizesList = ["S", "M", "L", "XL"];

/* ------------------ PAGE ------------------ */
export default function AddProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f6f6]" />}>
      <AddProductContent />
    </Suspense>
  );
}

/* ------------------ CONTENT (with hooks) ------------------ */
function AddProductContent() {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit"); // Get edit slug from query params
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [variantErrors, setVariantErrors] = useState<boolean[]>([]);
  const [colorInput, setColorInput] = useState({ name: "", value: "#000000" });
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [productId, setProductId] = useState<string | null>(null); // MongoDB _id for S3 folder
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!!editSlug);
  const [showSpinner, setShowSpinner] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // For very fast fetches, we don't want to flash the spinner.
  // We only show it if loading takes longer than 200ms.
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoadingProduct) {
      timer = setTimeout(() => setShowSpinner(true), 200);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [isLoadingProduct]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && (!isLoggedIn() || !isAdmin)) {
      router.replace("/login");
    }
  }, [mounted, isLoggedIn, isAdmin, router]);

  // Load product data if editing
  useEffect(() => {
    if (!editSlug) return;
    const loadProduct = async () => {
      try {
        const res: any = await getProductBySlug(editSlug);
        const data = res?.data ?? res;
        
        // Store the _id for S3 folder organization
        if (data._id) setProductId(data._id);
        
        // Populate form fields
        setValue("title", data.title);
        setValue("brand", data.brand);
        setValue("category", data.category);
        setValue("description", data.description);
        setValue("base_price", String(data.base_price)); // Convert number to string for form
        setValue("showInLanding", data.showInLanding || false);
        
        // Set colors
        if (data.attributes?.colors) {
          setColors(data.attributes.colors);
        }
        
        // Set sizes
        if (data.attributes?.sizes) {
          setSizes(data.attributes.sizes);
        }
        
        // Set images
        if (data.images) {
          setImages(data.images);
        }
        
        // Set thumbnail
        if (data.landing_thumbnail) {
          setThumbnail(data.landing_thumbnail);
        }
        
        // Generate variants
        if (data.attributes?.sizes && data.attributes?.colors) {
          const newVariants = [];
          for (const size of data.attributes.sizes) {
            for (const color of data.attributes.colors) {
              const existing = data.variants?.find((v: any) => v.size === size && v.color === color.name);
              newVariants.push({ size, color: color.name, stock: existing?.stock || 0, price: existing?.price || 0 });
            }
          }
          setVariants(newVariants);
          setVariantErrors(new Array(newVariants.length).fill(false));
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      } finally {
        setIsLoadingProduct(false);
      }
    };
    loadProduct();
  }, [editSlug, setValue]);

  /* ------------------ VARIANTS ------------------ */
  useEffect(() => {
    if (sizes.length === 0 || colors.length === 0) { setVariants([]); return; }
    const newVariants: any[] = [];
    sizes.forEach((size) => {
      colors.forEach((color) => {
        const existing = variants.find((v) => v.size === size && v.color === color.name);
        newVariants.push({ size, color: color.name, stock: existing?.stock || 0, price: existing?.price || 0 });
      });
    });
    setVariants(newVariants);
  }, [sizes, colors]);

  // Prevent flicker: show blank background until hydration is finished
  if (!mounted) {
    return <div className="min-h-screen bg-[#f6f6f6]" />;
  }

  if (showSpinner) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  // Blank state while auth/product is still being determined to avoid form flicker
  if (isLoadingProduct || (!isLoggedIn() || !isAdmin)) {
    return <div className="min-h-screen bg-[#f6f6f6]" />;
  }

  /* ------------------ SIZE ------------------ */
  const toggleSize = (size: string) =>
    setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);

  /* ------------------ COLOR ------------------ */
  const addColor = () => {
    if (!colorInput.name) return;
    setColors((prev) => [...prev, colorInput]);
    setColorInput({ name: "", value: "#000000" });
  };
  const removeColor = (index: number) =>
    setColors((prev) => prev.filter((_, i) => i !== index));

  /* ------------------ IMAGE ------------------ */
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);
    setImages((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
  };
  
  const handleThumbnailUpload = (file: File | null) => {
    if (!file) return;
    setThumbnailFile(file);
    setThumbnail(URL.createObjectURL(file));
  };

  const removeImage = (index: number) => {
    // If it's an existing image (URL starts with http), just remove from images
    // If it's a new file, we need to find its index in imageFiles
    // Simplified: keep track of which is which
    setImages(prev => prev.filter((_, i) => i !== index));
    // This is a bit tricky since we don't know if the i-th image is from imageFiles or existing
    // Let's just reset imageFiles for simplicity or manage better
    // For now, if we match the preview URL, we can remove
  };


  const updateVariant = (index: number, key: "stock" | "price", value: number) => {
    const safeValue = Math.max(0, value);
    setVariants((prev) => { const updated = [...prev]; updated[index][key] = safeValue; return updated; });
  };

  /* ------------------ SUBMIT ------------------ */
  const onSubmit = async (data: any) => {
    if (variants.length === 0) { alert("Please select sizes & colors to generate variants"); return; }
    const errs = variants.map((v) => !v.price || Number(v.price) <= 0);
    setVariantErrors(errs);
    if (errs.some(Boolean)) return;

    setIsLoading(true);
    try {
      // Use product ID for S3 folder. For new products, use a temp ID that will be replaced on re-edit.
      const s3ProductId = productId || "new";

      // 1. Upload Thumbnail if changed
      let finalThumbnail = thumbnail;
      if (thumbnailFile) {
        const presigned: any = await getPresignedUrl(thumbnailFile.name, thumbnailFile.type, s3ProductId, "thumbnail");
        const presignedData = presigned.data ?? presigned;
        await uploadFileToS3(presignedData.upload_url, thumbnailFile);
        finalThumbnail = presignedData.file_url;
      }

      // 2. Upload new images (keep existing CloudFront URLs, upload only new File objects)
      const existingUrls = images.filter(img => img.startsWith("http"));
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const presigned: any = await getPresignedUrl(file.name, file.type, s3ProductId, "images");
        const presignedData = presigned.data ?? presigned;
        await uploadFileToS3(presignedData.upload_url, file);
        uploadedUrls.push(presignedData.file_url);
      }

      const finalImages = [...existingUrls, ...uploadedUrls];

      const payload = {
        title: data.title,
        brand: data.brand,
        category: data.category,
        description: data.description,
        base_price: Number(data.base_price),
        showInLanding: data.showInLanding || false,
        attributes: { colors: colors.map((c) => ({ name: c.name, value: c.value })), sizes },
        variants: variants.map((v) => ({ 
          color: v.color, 
          size: v.size, 
          price: Number(v.price), 
          stock: Number(v.stock),
          sku: v.sku // Keep SKU if existing
        })),
        images: finalImages,
        landing_thumbnail: finalThumbnail,
      };

      let res: any;
      if (editSlug) {
        res = await updateProduct(editSlug, payload);
        setImageFiles([]); // Clear pending files, keep saved URLs
        setThumbnailFile(null);
        setSuccessMsg("Product updated successfully ✓");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        res = await createProduct(payload);
        const data = res?.data ?? res;
        const newSlug = data?.slug;
        setSuccessMsg("Product created successfully ✓");
        setTimeout(() => setSuccessMsg(null), 4000);
        if (newSlug) router.replace(`/admin/products/add?edit=${newSlug}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-[#f6f6f6] p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 md:p-10 shadow-sm rounded">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">{editSlug ? "Edit Product" : "Add Product"}</h1>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)(e); }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
        >
          {/* ── LEFT ── */}
          <div className="space-y-5">
            <Field label="Title" error={errors.title?.message}>
              <input {...register("title")} className="input" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Brand" error={errors.brand?.message}>
                <select {...register("brand")} className="input">
                  <option value="">Select Brand</option>
                  {brands.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Category" error={errors.category?.message}>
                <select {...register("category")} className="input">
                  <option value="">Select Category</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Base Price" error={errors.base_price?.message}>
              <input type="number" min="0" {...register("base_price")} className="input" />
            </Field>

            <Field label="Description" error={errors.description?.message}>
              <textarea {...register("description")} className="input h-28" />
            </Field>

            <Field label="Show in Landing">
              <input type="checkbox" {...register("showInLanding")} className="w-4 h-4" />
            </Field>

            <div>
              <p className="label">Sizes</p>
              <div className="flex gap-2 flex-wrap">
                {sizesList.map((s) => (
                  <button
                    type="button" key={s} onClick={() => toggleSize(s)}
                    className={`chip ${sizes.includes(s) ? "active" : ""}`}
                  >{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="space-y-5">
            {/* Images */}
            <div>
              <p className="label">Product Images</p>
              <div className="upload-box">
                <input type="file" multiple onChange={(e) => handleImageUpload(e.target.files)} />
                <p className="text-sm text-gray-400 mt-1">Drag & drop or click</p>
              </div>
              <div className="flex gap-3 mt-3 flex-wrap">
                {images.map((img, i) => <img key={i} src={img} className="preview-img" alt={`img-${i}`} />)}
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <p className="label">Landing Thumbnail</p>
              <div className="upload-box">
                <input type="file" onChange={(e) => handleThumbnailUpload(e.target.files?.[0] || null)} />
                <p className="text-sm text-gray-400 mt-1">Upload thumbnail</p>
              </div>
              {thumbnail && <img src={thumbnail} className="preview-img mt-3" alt="thumbnail" />}
            </div>

            {/* Colors */}
            <div>
              <p className="label">Colors</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <input
                  placeholder="Color Name"
                  className="input flex-1 min-w-[120px]"
                  value={colorInput.name}
                  onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                />
                <input
                  type="color"
                  className="h-11 w-12 border cursor-pointer rounded"
                  value={colorInput.value}
                  onChange={(e) => setColorInput({ ...colorInput, value: e.target.value })}
                />
                <button type="button" onClick={addColor} className="btn whitespace-nowrap">
                  + Add
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c, i) => (
                  <div key={i} className="chip flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: c.value }} />
                    <span className="text-xs">{c.name}</span>
                    <button type="button" onClick={() => removeColor(i)} className="text-gray-400 hover:text-black">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── VARIANTS (full width, scrollable on mobile) ── */}
          {variants.length > 0 && (
            <div className="col-span-1 md:col-span-2">
              <p className="label mb-3">Variants</p>
              <div className="border rounded overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Size</th>
                      <th className="text-left px-4 py-3 font-medium">Color</th>
                      <th className="text-left px-4 py-3 font-medium">Stock</th>
                      <th className="text-left px-4 py-3 font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v, i) => (
                      <tr key={i} className={`border-t ${variantErrors[i] ? "bg-red-50" : ""}`}>
                        <td className="px-4 py-3">{v.size}</td>
                        <td className="px-4 py-3">{v.color}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number" min="0" value={v.stock || ""} placeholder="0"
                            onChange={(e) => updateVariant(i, "stock", Number(e.target.value))}
                            className="input"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number" min="0" value={v.price || ""} placeholder="Required"
                            onChange={(e) => {
                              updateVariant(i, "price", Number(e.target.value));
                              setVariantErrors((prev) => {
                                const next = [...prev];
                                next[i] = !e.target.value || Number(e.target.value) <= 0;
                                return next;
                              });
                            }}
                            className={`input ${variantErrors[i] ? "border-red-500 bg-red-50" : ""}`}
                          />
                          {variantErrors[i] && <p className="text-red-500 text-xs mt-1">Required</p>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SUBMIT ── */}
          <div className="col-span-1 md:col-span-2">
            {variantErrors.some(Boolean) && (
              <p className="text-red-500 text-sm mb-3">
                ⚠ Please enter a price for all variants before saving.
              </p>
            )}
            {successMsg && (
              <p className="text-green-600 text-sm mb-3 font-medium">✓ {successMsg}</p>
            )}
            <button
              type="submit"
              onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }}
              disabled={isLoading}
              className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input { width: 100%; border: 1px solid #ddd; padding: 10px; outline: none; font-size: 14px; }
        .input:focus { border-color: #000; }
        .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #666; margin-bottom: 6px; display: block; }
        .chip { border: 1px solid #ccc; padding: 5px 10px; cursor: pointer; font-size: 13px; border-radius: 2px; }
        .chip.active { background: black; color: white; border-color: black; }
        .upload-box { border: 2px dashed #ddd; padding: 16px; text-align: center; cursor: pointer; border-radius: 4px; }
        .preview-img { width: 72px; height: 72px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
        .btn { background: black; color: white; padding: 10px 16px; font-size: 13px; border-radius: 2px; }
        .btn:hover { opacity: 0.85; }
        .btn-primary { background: black; color: white; padding: 12px 28px; margin-top: 8px; font-size: 14px; border-radius: 2px; letter-spacing: 0.05em; }
        .btn-primary:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}

/* ------------------ FIELD ------------------ */
function Field({ label, children, error }: any) {
  return (
    <div>
      <p className="label">{label}</p>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
