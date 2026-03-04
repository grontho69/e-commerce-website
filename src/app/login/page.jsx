"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn } from "@/components/Motion";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
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
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-0.5 bg-black opacity-10" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Secure Access</span>
                  <div className="w-8 h-0.5 bg-black opacity-10" />
                </div>
                <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight uppercase mb-2 text-black">Welcome <span className="text-primary italic">Back</span></CardTitle>
                <CardDescription className="text-neutral-500 font-medium text-sm">Please enter your credentials to access your account</CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-100 flex items-center justify-center animate-shake">
                      Error: {error}
                    </div>
                  )}
                  
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
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Password</label>
                      <Link href="#" className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline transition-opacity">Forgot Password?</Link>
                    </div>
                    <Input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••••••"
                      className="h-12 rounded-xl bg-neutral-50 border-neutral-100 focus:bg-white transition-all text-sm font-medium text-black px-6"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/10 mt-4 transition-all bg-black text-white hover:bg-neutral-800"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : "Sign In to Account"}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                  <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                    Don't have an account?
                    <Link href="/register" className="text-primary hover:underline ml-2">
                      Create One
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-neutral-100 max-w-sm mx-auto shadow-sm">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-6 italic">Demo Access</h4>
              <div className="space-y-4 text-[10px] font-bold tracking-widest uppercase">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-neutral-300">User:</span>
                  <code className="text-black bg-neutral-50 px-3 py-1 rounded">demo@volans.com</code>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-neutral-300">Password:</span>
                  <code className="text-black bg-neutral-50 px-3 py-1 rounded">Demo1234!</code>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-xl font-black italic text-primary uppercase animate-pulse">Initializing Security Node...</div>
       </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
