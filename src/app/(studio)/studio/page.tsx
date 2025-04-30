<<<<<<< HEAD
import { DEFAULT_VALUE } from "@/costant";
import { StudioView } from "@/modules/studio/ui/views/studio-view.";
import { HydrateClient, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic";


const Page = async()=>{
    void trpc.studio.getMany.prefetchInfinite({
        limit: DEFAULT_VALUE
    });
    return  (
        <HydrateClient>
            <StudioView/>
        </HydrateClient>
    )}
export default Page
=======
import { DEFAULT_LIMIT } from "@/constants";
import { StudioView } from "@/modules/studio/ui/views/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

export const dynamic = "force-dynamic";

const Page = async () => {
  void trpc.studio.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Page;
>>>>>>> 9f21a4b (internal structure improvements)
