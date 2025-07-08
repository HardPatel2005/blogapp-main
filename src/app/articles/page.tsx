// src/app/articles/page.tsx

import { AllArticlesPage } from "@/components/articles/all-articles-page";
import ArticleSearchInput from "@/components/articles/article-search-input";
import { Button } from "@/components/ui/button";
import { fetchArticleByQuery } from "@/lib/query/fetch-articles";
import Link from "next/link";
import { AllArticlesPageSkeleton } from "@/components/articles/all-articles-skeleton";

// Optional: mark page as dynamic if using data-fetching
export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 6;

// ✅ Define a precise interface for PageProps
interface ArticlePageProps {
  searchParams?: {
    search?: string;
    page?: string;
    // Add any other potential search params here if they exist in your URLs
  };
}

// ✅ Page Component for Next.js App Router
export default async function Page({ searchParams }: ArticlePageProps) {
  const searchText = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const { articles, total } = await fetchArticleByQuery(searchText, skip, take);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            All Articles
          </h1>

          {/* ✅ Client-side input can be suspended */}
          <ArticleSearchInput />
        </div>

        {/* ✅ Do NOT wrap server components in Suspense */}
        {articles.length === 0 ? (
          <AllArticlesPageSkeleton />
        ) : (
          <AllArticlesPage articles={articles} />
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          <Link href={`?search=${searchText}&page=${currentPage - 1}`}>
            <Button variant="ghost" size="sm" disabled={currentPage === 1}>
              ← Prev
            </Button>
          </Link>

          {Array.from({ length: totalPages }).map((_, index) => (
            <Link
              key={index}
              href={`?search=${searchText}&page=${index + 1}`}
            >
              <Button
                variant={
                  currentPage === index + 1 ? "destructive" : "ghost"
                }
                size="sm"
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </Button>
            </Link>
          ))}

          <Link href={`?search=${searchText}&page=${currentPage + 1}`}>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
            >
              Next →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}