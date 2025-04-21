import { DEFAULT_VALUE } from "@/costant";
import { SearchViews } from "@/modules/search/ui/views/search-view";
import { trpc } from "@/trpc/client";
import { HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic"

interface PageProps{
    searchParams: Promise<{
        query: string|undefined ;
        categoryId: string | undefined;
    }>
}

const Page = async ({searchParams}:PageProps) =>{
    const {query, categoryId}=  await searchParams;
    void trpc.categories.getMany.prefetch();
    void trpc.search.getMany.prefetchInfinite({
      query,
      categoryId,
      limit: DEFAULT_VALUE,
    });
    

    return(
       <HydrateClient>
        <SearchViews query={query} categoryId={categoryId}/>
       </HydrateClient>
    )
}

export default Page;