"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Zod schema for form validation
const updateArticleSchema = z.object({
  title: z.string().min(3, "Title is too short").max(100),
  category: z.string().min(3, "Category is required").max(50),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type UpdateArticleFormState = {
  errors: {
    title?: string[];
    category?: string[];
    featuredImage?: string[];
    content?: string[];
    formErrors?: string[];
  };
};

export const updateArticles = async (
  articleId: string,
  prevState: UpdateArticleFormState,
  formData: FormData
): Promise<UpdateArticleFormState> => {
  // ✅ Validate form data
  const result = updateArticleSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

 // ✅ Authenticate user
const { userId } = await auth();
if (!userId) {
  return {
    errors: {
      formErrors: ["You must be logged in to update the article."],
    },
  };
}


  // ✅ Fetch article
  const existingArticle = await prisma.articles.findUnique({
    where: { id: articleId },
  });

  if (!existingArticle) {
    return {
      errors: {
        formErrors: ["Article not found."],
      },
    };
  }

  // ✅ Fetch current user
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || existingArticle.authorId !== user.id) {
    return {
      errors: {
        formErrors: ["You are not authorized to edit this article."],
      },
    };
  }

  let imageUrl = existingArticle.featuredImage;

  // ✅ Upload image if a new one is provided
  const imageFile = formData.get("featuredImage") as File | null;
  if (imageFile && imageFile.size > 0) {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error || !result) reject(error || new Error("Upload failed"));
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      if (uploadResult.secure_url) {
        imageUrl = uploadResult.secure_url;
      } else {
        return {
          errors: {
            featuredImage: ["Image upload failed. Please try again."],
          },
        };
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        errors: {
          formErrors: ["An error occurred while uploading the image."],
        },
      };
    }
  }

  // ✅ Update article
  try {
    await prisma.articles.update({
      where: { id: articleId },
      data: {
        title: result.data.title,
        category: result.data.category,
        content: result.data.content,
        featuredImage: imageUrl,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return {
      errors: {
        formErrors: ["Failed to update article. Try again later."],
      },
    };
  }

  // ✅ Revalidate & redirect
  revalidatePath("/dashboard");
  redirect("/dashboard");
};
