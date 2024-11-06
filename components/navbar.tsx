"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          LangChain.js
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Auth temporarily disabled */}
        </div>
      </div>
    </nav>
  )
} 