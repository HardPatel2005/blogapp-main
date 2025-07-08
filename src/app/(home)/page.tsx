// src/app/(home)/page.tsx

import { BlogFooter } from "@/components/home/blog-footer";
import HeroSection from "@/components/home/hero-section";
import { TopArticles } from "@/components/home/top-articles";
import { Button } from "@/components/ui/button"; // Keep if you use it elsewhere on the page
import Link from "next/link"; // Keep if you use it elsewhere on the page
import React, { Suspense } from "react";

// Import your unified Navbar component
import { Navbar } from "@/components/home/header/navbar";

// This is a Server Component, so it can fetch data if needed,
// but the Navbar itself is a client component.
const HomePage = async () => {
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * HomePage is a Server Component that fetches user data with Clerk's currentUser()
 * and conditionally renders the authenticated Navbar or a simplified header for the landing page.
 * It also renders the HeroSection, a Featured Articles section with top articles fetched from Prisma,
 * and the BlogFooter.
 */
/*******  5163436a-57ef-48af-bcf7-7f355f661f05  *******/  // No need for currentUser() here for header logic, as Navbar handles its own user state.

  return (
    <div className="flex flex-col min-h-screen">
      {/* Render the unified Navbar component at the top of your page */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Articles Section */}
        <section className="relative py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Featured Articles
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Discover our most popular and trending content
              </p>
            </div>

            <Suspense fallback={<h1>Loading articles...</h1>}>
              <TopArticles />
            </Suspense>

            <div className="mt-12 text-center">
              <Link href={"/articles"}>
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900"
                >
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Blog Footer */}
      <BlogFooter />
    </div>
  );
};

export default HomePage;