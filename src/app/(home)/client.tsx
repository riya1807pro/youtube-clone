"use client";

import { trpc } from "@/trpc/client";
export default function PageClient() {
  // Using TRPC's useSuspenseQuery hook to fetch data
  const [data] = trpc.hello.useSuspenseQuery({
    text: "riya",
  });

  return <div>{data.greeting}</div>;
}
