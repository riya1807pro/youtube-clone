<<<<<<< HEAD
interface PageProps {
  searchParams: Promise<{
    categoryId: string;
  }>;
}
// pages/index.tsx or your home page component

import HomeView from "@/modules/home/ui/views/home-view";
import { trpc, HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;
  void (await trpc.categories.getMany.prefetch());

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId as string} />
    </HydrateClient>
  );
};
=======
import { DEFAULT_LIMIT } from "@/constants";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();
  void trpc.videos.getMany.prefetchInfinite({
    categoryId,
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
};

>>>>>>> 9f21a4b (internal structure improvements)
export default Page;
