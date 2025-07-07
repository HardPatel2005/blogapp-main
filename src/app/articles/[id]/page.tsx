import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { prisma } from "@/lib/prisma";
import React from "react";

type ArticleDetailPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Page component for the article detail page.
 *
 * It fetches the article with the given id from the database and renders
 * the    ArticleDetailPage component with the article as a prop.
 *
 * If the article is not found, it returns a 404 page with a message.
 *
 * @returns The ArticleDetailPage component with the article as a prop.
 */ 
const page: React.FC<ArticleDetailPageProps> = async ({ params }) => {
  const id = (await params).id;
  const article = await prisma.articles.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });
  if (!article) {
    return <h1>Article not found.</h1>;
  }
  return (
    <div>
      <ArticleDetailPage article={article} /> 
    </div>
  );
};

export default page;
