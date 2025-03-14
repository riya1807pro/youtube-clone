import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { 
    VideoAssetCreatedWebhookEvent,
    VideoAssetDeletedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent
 } from "@mux/mux-node/resources/webhooks";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { string } from "zod";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type webhookEvent = 
    | VideoAssetCreatedWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetTrackReadyWebhookEvent
    |VideoAssetDeletedWebhookEvent;


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
            console.log("creating  videos ", {uploadId: data.upload_id})
            await db
                .update(videos)
                .set({
                    muxAssetId: data.id,
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploaderId, data.upload_id))
                break;
        }
        case "video.asset.ready": {
            const data = payload as VideoAssetReadyWebhookEvent["data"];
            const playbackId =  data.playback_ids?.[0].id; 

            if(!data.upload_id){
                return new Response("No upload ID found", { status: 400 });
            }

            if(!playbackId){
                return new Response("No playback ID found", { status: 400 });
            }
        
            const thumbnailUrl = `https://image.mux.com./${playbackId}/thumbnail.jpg`;
        const previewUrl = `https://image.mux.com./${playbackId}/anianimated.gif`;
        const duration = data.duration? Math.round(data.duration*1000): 0;

            await db 
            .update(videos)
            .set({
                muxAssetId: videos.id,
                muxPlaybackId : playbackId,
                muxStatus: data.status,
                thumbnailUrl,
                previewUrl,
                duration,
            })
            .where(eq(videos.muxUploaderId,data.upload_id))
            break;
        }
        case "video.asset.errored":{
            const data = payload.data as VideoAssetErroredWebhookEvent["data"];
            
            if(!data.upload_id){
                return new Response("No upload ID found", { status: 400 });
            }
            await db 
            .update(videos)
            .set({
                muxStatus: data.status,
            })
            .where(eq(videos.muxUploaderId,data.upload_id))
            break;

        }

        case "video.asset.deleted":{
            const data = payload.data as VideoAssetDeletedWebhookEvent["data"];
            
            if(!data.upload_id){
                return new Response("No upload ID found", { status: 400 });
            }

            console.log("Deleting videos ", {uploadId: data.upload_id})

            await db 
            .delete(videos)
            .where(eq(videos.muxUploaderId,data.upload_id))
            break;

        }

        
        case "video.asset.track.ready":{
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
                asset_id: string
            };

            console.log("track ready")

            const asset_id= data.asset_id;
            const trackiD= data.id;
            const status= data.status;
    
            if(!asset_id){
                return new Response("No asset ID found", { status: 400 });
            }
            await db 
            .update(videos)
            .set({
                muxTrackStatus: status,
                muxTrackId: trackiD
            })
            .where(eq(videos.muxAssetId,asset_id))
            break;
    


        }
    }
    
 return new Response("Webhook created", { status: 200 });
    
}