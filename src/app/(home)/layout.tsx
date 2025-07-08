// src/app/(home)/layout.tsx

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const HomeRootLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  // If user is logged in, perform Prisma lookup/creation
  if (user) {
    let loggedInUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (!loggedInUser) {
      loggedInUser = await prisma.user.create({
        data: {
          name: `${user.fullName || ''} ${user.lastName || ''}`.trim(),
          clerkUserId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          imageUrl: user.imageUrl,
        },
      });
    }
  }

  return (
    <div>
      {/* The children prop here will be src/app/(home)/page.tsx */}
      {children}
    </div>
  );
};

export default HomeRootLayout;