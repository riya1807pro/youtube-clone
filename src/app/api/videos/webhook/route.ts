import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { 
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent
 } from "@mux/mux-node/resources/webhooks";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type webhookEvent = 
    | VideoAssetCreatedWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetTrackReadyWebhookEvent;


export const POST = async (request: Response) => {
    if(!SIGNING_SECRET) {
        throw new Error("No signing secret found for Mux webhook");
    }
    const headersPayload = await headers();
    const muxSignature = headersPayload.get("mux-signature");


    if(!muxSignature) {
throw new Response("No signature found", { status: 401   });
    }
    const payload = await request.json();
    const body = JSON.stringify(payload);

    mux.webhooks.verifySignature(
        body,{
            "mux-signature": muxSignature,
        },
        SIGNING_SECRET
    );

    switch (payload.type as webhookEvent["type"]) {
        case "video.asset.created": {
            const data = payload as VideoAssetCreatedWebhookEvent["data"];
            
            if(!data.upload_id){
                return new Response("No upload ID found", { status: 400 });
            }
            await db
                .update(videos)
                .set({
                    muxAssetId: data.id,
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploaderId, data.upload_id))
                break;
        }
    }
    return new Response("Webhook created", { status: 200 });
}