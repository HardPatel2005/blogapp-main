import { AllArticlesPage } from "@/components/articles/all-articles-page";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { fetchArticleByQuery } from "@/lib/query/fetch-articles";
import Link from "next/link";
import { AllArticlesPageSkeleton } from "@/components/articles/all-articles-skeleton";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 6;

// PageProps for route parameters
type PageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // 🟢 No search filtering
  const searchText = "";
  const { articles, total } = await fetchArticleByQuery(searchText, skip, ITEMS_PER_PAGE);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">All Articles</h1>
        </div>

        {/* Articles Grid */}
        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllArticlesPage articles={articles} />
        </Suspense>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          <Link href={`?page=${currentPage - 1}`}>
            <Button variant="ghost" size="sm" disabled={currentPage === 1}>
              ← Prev
            </Button>
          </Link>

          {Array.from({ length: totalPages }).map((_, index) => (
            <Link key={index} href={`?page=${index + 1}`}>
              <Button
                variant={currentPage === index + 1 ? "destructive" : "ghost"}
                size="sm"
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </Button>
            </Link>
          ))}

          <Link href={`?page=${currentPage + 1}`}>
            <Button variant="ghost" size="sm" disabled={currentPage === totalPages}>
              Next →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
