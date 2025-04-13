import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { error } from "console";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string,
  videoId:string,
}

const Description_SYSTEM_PROMPT = `Your task is to generate an SEO-focused description for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the description is 3–8 words long and no more than 100 characters.
- ONLY return the description as plain text. Do not add quotes or any additional formatting.`;


export const { POST } = serve(
  async (context) => {
    const input =  context.requestPayload as InputType;
    const {userId, videoId} =input;

    const video = await context.run("get-videos",async ()=>{
      const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(
        eq(videos.id, videoId),
        eq(videos.userId, userId),
      ))
      if(!existingVideo){
        throw error("data not found")
      }

      console.log("existing videos: ", existingVideo);
      return existingVideo;
    })

    const transcript = await context.run("get-transcript", async () => {
      const trackURL = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch (trackURL);
    const text = response.text();
    
    if(!text){
      console.log("bad request for transcript text");
      
    }
    return text;
    })

    const {body}= await context.api.openai.call(
      "generate-description",
      {
        token: process.env.OPENAI_API_KEY!,
        operation: "chat.completions.create",
        body: {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:Description_SYSTEM_PROMPT
            },
            {
              role: "user",
              content: transcript,
            }
          ],
        },
      }
    );
    
    const description  =  body.choices[0]?.message.content;

    if(!description){
      throw new Error('Bad Request');
    }

    await context.run("update-video", async() => {
    await db
       .update(videos)
       .set({
        description:  description || video.description
       })
         .where(and(
        eq(videos.id,  video.id),
        eq(videos.userId,  video.userId),
      ))
    })

    await context.run("second-step", () => {
      console.log("second step ran")
    })
  }
)