"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn } from "@/components/Motion";
import { ArrowLeft, Upload, PackagePlus, Check, Info, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "",
    tier: "Bronze",
    sizes: "S, M, L, XL", // Default sizes
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY"; // Fallback placeholder
    if (!apiKey || apiKey === "YOUR_IMGBB_API_KEY") {
        toast.error("Config Error", { description: "ImgBB API Key is missing. Please check .env.local" });
        return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error.message || "Upload failed");
      }
    } catch (err) {
      console.error("ImgBB Upload error:", err);
      toast.error("Upload Failed", { description: "Could not upload image to ImgBB." });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate price
      const priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        toast.error("Invalid Price", { description: "Please enter a valid amount in BDT." });
        setIsLoading(false);
        return;
      }

      if (!selectedFile) {
        toast.error("Image Required", { description: "Please select an image file to upload." });
        setIsLoading(false);
        return;
      }

      // Step 1: Upload to ImgBB
      toast.loading("Uploading image...", { id: "uploading" });
      const uploadedUrl = await uploadToImgBB(selectedFile);
      toast.dismiss("uploading");

      if (!uploadedUrl) {
          setIsLoading(false);
          return;
      }

      // Step 2: Save to DB
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: uploadedUrl,
          price: priceNum,
          sizes: formData.sizes.split(",").map(s => s.trim()).filter(s => s !== ""),
          createdAt: new Date(),
        }),
      });

      if (res.ok) {
        toast.success("Product Created!", {
          description: "New item has been successfully published to the catalog.",
          icon: <Check className="text-green-500" />
        });
        router.push("/admin/products");
      } else {
        const data = await res.json();
        toast.error("Creation Failed", { description: data.message || "Could not save to the database." });
      }
    } catch (err) {
      toast.error("System Error", { description: "An unexpected error occurred during publication." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "title" && (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""))) {
        newData.slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      }
      return newData;
    });
  };

  return (
    <div className="pt-24 pb-32 bg-neutral-50 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="down">
            <div className="flex items-center space-x-4 mb-12">
              <Link href="/admin/products">
                <Button variant="ghost" size="icon" className="rounded-2xl bg-white hover:bg-neutral-100 shadow-sm border border-neutral-100">
                  <ArrowLeft size={20} className="text-black" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold tracking-tight uppercase text-black">Add New <span className="text-primary italic">Product</span></h1>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <Card className="rounded-3xl border border-neutral-100 shadow-sm overflow-hidden bg-white">
               <div className="bg-black p-10 text-white flex items-center justify-between">
                 <div>
                   <CardTitle className="text-2xl font-bold uppercase tracking-tight text-white">Product Details</CardTitle>
                   <CardDescription className="text-neutral-400 font-medium mt-2 uppercase text-[10px] tracking-widest">Enter the specifications for the new catalog entry</CardDescription>
                 </div>
                 <div className="bg-white/10 p-6 rounded-2xl text-white border border-white/10">
                   <PackagePlus size={32} />
                 </div>
               </div>
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Identity */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 text-black font-bold uppercase tracking-widest text-[10px]">
                       <div className="w-8 h-px bg-black" />
                       <span>01. Core Identity</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Product Title</label>
                        <Input name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Midnight Silk Panjabi" className="h-14 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-bold px-6 text-black" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Price (BDT)</label>
                        <Input name="price" type="number" required value={formData.price} onChange={handleChange} placeholder="2500" className="h-14 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-bold px-6 text-black" />
                      </div>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 text-black font-bold uppercase tracking-widest text-[10px]">
                       <div className="w-8 h-px bg-black" />
                       <span>02. Specifications</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Category</label>
                        <select name="category" required value={formData.category} onChange={handleChange} className="w-full h-14 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white transition-all text-sm font-bold px-4 appearance-none focus:outline-none text-black cursor-pointer">
                          <option value="">Select Category</option>
                          <option value="men">Men's Apparel</option>
                          <option value="women">Women's Apparel</option>
                          <option value="unisex">Unisex Apparel</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Fashion Tier</label>
                        <select name="tier" required value={formData.tier} onChange={handleChange} className="w-full h-14 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white transition-all text-sm font-bold px-4 appearance-none focus:outline-none text-black cursor-pointer">
                          <option value="Bronze">Bronze (Essential)</option>
                          <option value="Silver">Silver (Premium)</option>
                          <option value="Gold">Gold (Exclusive)</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1 flex items-center justify-between">
                          <span>Sizes Available</span>
                          <span className="text-[8px] opacity-50">S, M, L, XL</span>
                        </label>
                        <Input name="sizes" required value={formData.sizes} onChange={handleChange} placeholder="S, M, L, XL" className="h-14 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-bold px-6 text-black" />
                      </div>
                    </div>
                  </div>

                  {/* Narrative */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 text-black font-bold uppercase tracking-widest text-[10px]">
                       <div className="w-8 h-px bg-black" />
                       <span>03. Presentation</span>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Upload Product Image</label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                           <div className="md:col-span-1">
                              <div className="w-full aspect-[3/4] rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200 flex items-center justify-center overflow-hidden group hover:border-primary transition-all cursor-pointer relative">
                                 {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="flex flex-col items-center">
                                       <Upload className="text-neutral-300 mb-2 group-hover:text-primary transition-colors" size={24} />
                                       <span className="text-[8px] font-bold text-neutral-400 uppercase">Select File</span>
                                    </div>
                                 )}
                                 <input 
                                   type="file" 
                                   accept="image/*" 
                                   onChange={handleFileChange} 
                                   className="absolute inset-0 opacity-0 cursor-pointer"
                                 />
                              </div>
                           </div>
                           <div className="md:col-span-3 flex flex-col justify-center space-y-4">
                              <p className="text-xs text-neutral-500 font-medium">
                                 Select a high-resolution image for your product. Supported formats: JPG, PNG, WEBP.
                              </p>
                              {selectedFile && (
                                 <div className="flex items-center text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-lg border border-primary/20">
                                    <Check size={14} className="mr-2" /> {selectedFile.name}
                                 </div>
                              )}
                           </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Product Description</label>
                        <Textarea name="description" required value={formData.description} onChange={handleChange} placeholder="Describe the material, art, and fit..." className="min-h-[150px] rounded-2xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-medium p-8 shadow-inner text-black" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex items-start space-x-4 mb-4">
                     <Info className="text-neutral-400 shrink-0" size={20} />
                     <p className="text-[10px] font-bold text-neutral-400 leading-relaxed uppercase tracking-wider">
                        Validation: All fields are required. The image will be hosted on ImgBB. 
                        SKU/Slug is automatically generated.
                     </p>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-black/5 bg-black text-white hover:bg-neutral-800 transition-all">
                    {isLoading ? (
                       <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Publishing...</span>
                       </div>
                    ) : "Add to Catalog"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
