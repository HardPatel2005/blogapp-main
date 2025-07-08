// src/global.d.ts

// This allows us to augment the 'next' module's types
declare module 'next' {
  // Augment the PageProps type for Server Components
  // This helps ensure consistency when Next.js generates its internal types
  // Changed `any` to a more specific Record<string, string | string[]>
  export interface PageProps<
    P = Record<string, string | string[]>, // More specific than 'any'
    S = Record<string, string | string[]>  // More specific than 'any'
  > {
    params?: P;
    searchParams?: S;
  }
}

// You might also need to ensure React's JSX types are correctly loaded
// although usually next-env.d.ts handles this. Adding it here for robustness.
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any custom HTML attributes that you might be using and are not standard
    // For example, if you have a custom 'data-testid' that TS complains about:
    // 'data-testid'?: string;
  }
}