// src/components/home/header/navbar.tsx
"use client"; // This component uses client-side hooks (useState, Clerk hooks)

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming Shadcn UI Button
import { Menu, X } from "lucide-react"; // For mobile menu icon
import { ModeToggle } from "@/components/dark-mode"; // CORRECTED IMPORT PATH AND NAME

import Link from "next/link";
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Byte
                </span>
                <span className="text-foreground">Code</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/articles" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Articles</Link>
              <Link href="/tutorials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Tutorials</Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link>
              {/* Only show Dashboard link if user is signed in */}
              <SignedIn>
                <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
              </SignedIn>
            </div>
          </div>

          {/* Right Section - Theme + Auth */}
          <div className="flex items-center gap-4">
            <ModeToggle /> {/* Changed from ThemeToggle to ModeToggle */}

            {/* Auth Buttons / User Button */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" /> {/* Clerk's user profile button */}
            </SignedIn>
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                {/* Ensure SignInButton/SignUpButton wrap a clickable element like Button */}
                <SignInButton mode="modal">
                  <Button variant="outline">Login</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign up</Button>
                </SignUpButton>
              </div>
            </SignedOut>

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 px-4">
              <Link href="/articles" className="block px-3 py-2 text-base font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>Articles</Link>
              <Link href="/tutorials" className="block px-3 py-2 text-base font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>Tutorials</Link>
              <Link href="/about" className="block px-3 py-2 text-base font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              {/* Only show Dashboard link in mobile if user is signed in */}
              <SignedIn>
                <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              </SignedIn>
            </div>

            {/* Mobile Auth Buttons */}
            <SignedOut>
              <div className="px-4 flex flex-col gap-2">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">Login</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">Sign up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        )}
      </div>
    </nav>
  );
}