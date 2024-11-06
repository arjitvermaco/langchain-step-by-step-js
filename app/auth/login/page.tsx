"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome to LangChain.js Masterclass</h1>
        <p className="text-muted-foreground">Sign in to continue</p>
      </div>
      <Button 
        className="w-full" 
        onClick={handleGithubLogin}
        variant="outline"
      >
        Continue with GitHub
      </Button>
    </div>
  )
} 