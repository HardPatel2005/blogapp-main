// src/components/theme-provider.tsx
"use client";

import * as React from "react";
// CORRECTED IMPORT: Import ThemeProviderProps directly from 'next-themes'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
// Remove the problematic line: import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}