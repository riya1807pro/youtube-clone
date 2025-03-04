// pages/index.tsx or your home page component

import { trpc, HydrateClient } from "@/trpc/server";
import PageClient from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  void (await trpc.hello.prefetch({ text: "riya" }));

  return (
    <HydrateClient>
      <Suspense fallback={<p>loading...</p>}>
        <ErrorBoundary fallback={<p>error...</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
