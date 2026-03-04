"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn } from "@/components/Motion";
import { ArrowLeft, Upload, Edit3, Check, Info, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "",
    tier: "Bronze",
    sizes: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            ...data,
            sizes: Array.isArray(data.sizes) ? data.sizes.join(", ") : data.sizes || "",
          });
          setImagePreview(data.imageUrl);
        } else {
          toast.error("Failed to load product");
          router.push("/admin/products");
        }
      } catch (err) {
        toast.error("Error loading product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

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
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY";
    if (!apiKey || apiKey === "YOUR_IMGBB_API_KEY") {
        toast.error("Config Error", { description: "ImgBB API Key is missing." });
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
      toast.error("Upload Failed");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = formData.imageUrl;

      if (selectedFile) {
        toast.loading("Uploading new image...", { id: "uploading" });
        const uploadedUrl = await uploadToImgBB(selectedFile);
        toast.dismiss("uploading");
        if (uploadedUrl) {
           finalImageUrl = uploadedUrl;
        } else {
           setIsSaving(false);
           return;
        }
      }

      const priceNum = Number(formData.price);
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl,
          price: priceNum,
          sizes: formData.sizes.split(",").map(s => s.trim()).filter(s => s !== ""),
        }),
      });

      if (res.ok) {
        toast.success("Product Updated!", {
          description: "Changes have been successfully saved to the collection.",
          icon: <Check className="text-green-500" />
        });
        router.push("/admin/products");
      } else {
        const data = await res.json();
        toast.error("Update Failed", { description: data.message || "Could not sync changes." });
      }
    } catch (err) {
      toast.error("System Error", { description: "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-40 min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
        <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8">Loading Product...</h2>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 bg-neutral-50 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="down">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-neutral-200 pb-12">
              <div className="flex items-center space-x-6">
                <Link href="/admin/products">
                  <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl bg-white hover:bg-neutral-100 border border-neutral-200 transition-all group">
                    <ArrowLeft size={20} className="text-black group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div>
                   <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase text-black">Edit <span className="text-primary italic">Product</span></h1>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-3">Revision Node: {id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-100 px-6 py-3 rounded-2xl flex items-center space-x-3 shadow-sm">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-black">Live Data Sync</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <Card className="rounded-3xl border border-neutral-100 shadow-sm overflow-hidden bg-white">
               <div className="bg-black p-12 text-white flex items-center justify-between">
                 <div className="space-y-3">
                    <CardTitle className="text-3xl font-bold uppercase tracking-tight text-white leading-none">Blueprint Update</CardTitle>
                    <CardDescription className="text-neutral-400 font-medium text-[10px] uppercase tracking-widest leading-none">Update core parameters for the catalog entry</CardDescription>
                 </div>
                 <div className="bg-white/10 p-8 rounded-2xl text-white shadow-xl shadow-white/5">
                    <Edit3 size={32} />
                 </div>
               </div>

              <CardContent className="p-12">
                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Identity */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 text-black font-bold uppercase tracking-widest text-[10px]">
                       <div className="w-8 h-px bg-black" />
                       <span>Primary Identity</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Product Nomenclature</label>
                        <Input 
                          name="title" 
                          required 
                          value={formData.title} 
                          onChange={handleChange} 
                          className="h-16 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-bold px-6 text-black" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Calibration Price (BDT)</label>
                        <Input 
                          name="price" 
                          type="number" 
                          required 
                          value={formData.price} 
                          onChange={handleChange} 
                          className="h-16 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-bold px-6 text-black" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 text-black font-bold uppercase tracking-widest text-[10px]">
                       <div className="w-8 h-px bg-black" />
                       <span>Technical Parameters</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Category Division</label>
                        <div className="relative group">
                          <select 
                            name="category" 
                            required 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full h-16 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-xs font-bold uppercase tracking-widest px-6 appearance-none focus:outline-none text-black cursor-pointer"
                          >
                            <option value="men">Men's Apparel</option>
                            <option value="women">Women's Apparel</option>
                            <option value="unisex">Unisex Apparel</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none group-hover:text-black transition-colors" size={16} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Fashion Tier</label>
                        <div className="relative group">
                          <select 
                            name="tier" 
                            required 
                            value={formData.tier} 
                            onChange={handleChange} 
                            className="w-full h-16 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-xs font-bold uppercase tracking-widest px-6 appearance-none focus:outline-none text-black cursor-pointer"
                          >
                            <option value="Bronze">Bronze (Essential)</option>
                            <option value="Silver">Silver (Premium)</option>
                            <option value="Gold">Gold (Exclusive)</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none group-hover:text-black transition-colors" size={16} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Size Matrix</label>
                        <Input 
                          name="sizes" 
                          required 
                          value={formData.sizes} 
                          onChange={handleChange} 
                          placeholder="S, M, L, XL" 
                          className="h-16 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-bold px-6 text-black" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visualization */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 text-black font-bold uppercase tracking-widest text-[10px]">
                       <div className="w-8 h-px bg-black" />
                       <span>Visual Presentation</span>
                    </div>
                    <div className="space-y-8">
                       <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Product Image Selection</label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                           <div className="md:col-span-1">
                              <div className="w-full aspect-[3/4] rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200 flex items-center justify-center overflow-hidden group hover:border-primary transition-all cursor-pointer relative shadow-inner">
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
                                 Upload a new high-definition image to replace the existing one. 
                                 Recommended ratio is 3:4 for optimal display.
                              </p>
                              {selectedFile ? (
                                 <div className="flex items-center text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-lg border border-primary/20 self-start">
                                    <Check size={14} className="mr-2" /> New image ready to upload
                                 </div>
                              ) : (
                                 <div className="flex items-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                    <Info size={14} className="mr-2" /> Using currently hosted image
                                 </div>
                              )}
                           </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Craftsmanship Narrative</label>
                        <Textarea 
                          name="description" 
                          required 
                          value={formData.description} 
                          onChange={handleChange} 
                          className="min-h-[200px] rounded-2xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-medium p-10 text-black leading-relaxed" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex items-start space-x-4">
                     <Info className="text-neutral-400 shrink-0" size={20} />
                     <p className="text-[10px] font-bold text-neutral-400 leading-relaxed uppercase tracking-widest">
                        Note: Changes made to the product specifications will be reflected globally across all collection interfaces immediately upon commitment.
                     </p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSaving} 
                    className="w-full h-16 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-black/5 transition-all bg-black text-white hover:bg-neutral-800"
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Synchronizing Changes...</span>
                      </div>
                    ) : (
                       <span className="flex items-center gap-3">
                          Commit Modifications <ChevronRight size={18} />
                       </span>
                    )}
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
