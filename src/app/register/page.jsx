"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn } from "@/components/Motion";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Registration successful! Please login.");
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-24 pb-32 bg-neutral-50 min-h-screen">
      <Container>
        <div className="max-w-xl mx-auto">
          <FadeIn direction="up">
            <Card className="rounded-3xl border border-neutral-100 shadow-sm p-8 md:p-12 bg-white relative overflow-hidden">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-black border border-neutral-100 shadow-sm">
                  <UserPlus size={28} />
                </div>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-px bg-black opacity-10" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Join the Collective</span>
                  <div className="w-8 h-px bg-black opacity-10" />
                </div>
                <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight uppercase mb-2 text-black">Create <span className="text-primary italic">Account</span></CardTitle>
                <CardDescription className="text-neutral-500 font-medium text-sm">Join Volans for an exclusive shopping experience</CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-100 flex items-center justify-center animate-shake">
                      Error: {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Full Name</label>
                    <Input
                      type="text"
                      name="name"
                      required
                      placeholder="John Doe"
                      className="h-12 rounded-xl bg-neutral-50 border-neutral-100 focus:bg-white transition-all text-sm font-medium text-black px-6"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      className="h-12 rounded-xl bg-neutral-50 border-neutral-100 focus:bg-white transition-all text-sm font-medium text-black px-6"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Password</label>
                    <Input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••••••"
                      className="h-12 rounded-xl bg-neutral-50 border-neutral-100 focus:bg-white transition-all text-sm font-medium text-black px-6"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <p className="text-[9px] text-neutral-400 ml-1 uppercase tracking-widest font-bold">Minimum 8 characters required.</p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/10 mt-4 transition-all bg-black text-white hover:bg-neutral-800"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : "Create Account"}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                  <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                    Already have an account?
                    <Link href="/login" className="text-primary hover:underline ml-2">
                      Sign In
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

             <div className="mt-8 text-center px-8 opacity-40">
                <p className="text-[9px] text-neutral-500 leading-tight font-bold uppercase tracking-widest">
                  By creating an account, you agree to our <span className="text-black">Terms of Service</span> and <span className="text-black">Privacy Policy</span>.
                </p>
             </div>
          </FadeIn>
        </div>
      </Container>
    </div>

  );
}
