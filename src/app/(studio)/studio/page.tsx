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