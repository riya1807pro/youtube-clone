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
export default Page;
