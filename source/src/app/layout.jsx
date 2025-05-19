"use client";

import { Suspense } from "react";
import { PageLayout } from "@components";
import "@assets/styles/css/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="top-anchor"></div>
        <Suspense fallback={<>loading...</>}>
          <PageLayout> {children}</PageLayout>
        </Suspense>
      </body>
    </html>
  );
}
