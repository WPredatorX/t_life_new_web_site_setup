"use client";

import { PageLayoutProvider, PageLayoutMainContent } from "./components";

const PageLayout = ({ children }) => {
  return (
    <PageLayoutProvider>
      <PageLayoutMainContent>{children}</PageLayoutMainContent>
    </PageLayoutProvider>
  );
};

export default PageLayout;
