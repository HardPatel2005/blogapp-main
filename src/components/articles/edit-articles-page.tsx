"use client";

import { FormEvent, useState, useTransition } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Articles } from "@prisma/client";
import { updateArticles } from "@/actions/update-article";
import Image from "next/image";

type EditPropsPage = {
  article: Articles;
};

const EditArticlePage: React.FC<EditPropsPage> = ({ article }) => {
  const [content, setContent] = useState(article.content);
  const [isPending, startTransition] = useTransition();
  const [formErrors, setFormErrors] = useState<Record<string, string | string[]>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("content", content);
startTransition(async () => {
  const result = await updateArticles(article.id, { errors: {} }, formData);
  if (result?.errors) {
    setFormErrors(result.errors);
  } else {
    window.location.href = `/articles/${article.id}`;
  }
});
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={article.title}
                placeholder="Enter article title"
                required
              />
              {formErrors.title && (
                <span className="font-medium text-sm text-red-500">
                  {formErrors.title as string}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                defaultValue={article.category}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select Category</option>
                <option value="technology">Technology</option>
                <option value="programming">Programming</option>
                <option value="web-development">Web Development</option>
              </select>
              {formErrors.category && (
                <span className="font-medium text-sm text-red-500">
                  {formErrors.category as string}
                </span>
              )}
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              {article.featuredImage && (
                <div className="mb-4">
                  <Image
                    src={article.featuredImage}
                    alt="Current featured"
                    width={192}
                    height={128}
                    className="object-cover rounded-md"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Current featured image
                  </p>
                </div>
              )}
              <Input
                id="featuredImage"
                name="featuredImage"
                type="file"
                accept="image/*"
              />
              {formErrors.featuredImage && (
                <span className="font-medium text-sm text-red-500">
                  {formErrors.featuredImage as string}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
              />
              {formErrors.content && (
                <span className="font-medium text-sm text-red-500">
                  {(formErrors.content as string[])[0]}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Discard Changes
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? "Updating..." : "Update Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditArticlePage;
