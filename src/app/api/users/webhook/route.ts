import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
<<<<<<< HEAD
  // const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;
  // console.log(
  //   "-------------------------------------------------------------------"
  // );
  // console.log("Headers:", Object.fromEntries(req.headers));
  // console.log("Body:", await req.text());
  // console.log(
  //   "-------------------------------------------------------------------"
  // );

  // if (!SIGNING_SECRET) {
  //   throw new Error(
  //     "Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env"
  //   );
  // }

  // // Create new Svix instance with secret
  // const wh = new Webhook(SIGNING_SECRET);

  // // Get headers
  // const headerPayload = await headers();
  // const svix_id = headerPayload.get("svix-id");
  // const svix_timestamp = headerPayload.get("svix-timestamp");
  // const svix_signature = headerPayload.get("svix-signature");

  // // If there are no headers, error out
  // if (!svix_id || !svix_timestamp || !svix_signature) {
  //   return new Response("Error: Missing Svix headers", {
  //     status: 400,
  //   });
  // }

  // // Get body
  // const payload = await req.json();
  // const body = JSON.stringify(payload);

  // let evt: WebhookEvent;

  // // Verify payload with headers
  // try {
  //   evt = wh.verify(body, {
  //     "svix-id": svix_id,
  //     "svix-timestamp": svix_timestamp,
  //     "svix-signature": svix_signature,
  //   }) as WebhookEvent;
  // } catch (err) {
  //   console.error("Error: Could not verify webhook:", err);
  //   return new Response("Error: Verification error", {
  //     status: 400,
  //   });
  // }

=======
>>>>>>> 9f21a4b (internal structure improvements)
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
<<<<<<< HEAD
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
=======
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
>>>>>>> 9f21a4b (internal structure improvements)
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
<<<<<<< HEAD
=======

>>>>>>> 9f21a4b (internal structure improvements)
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { data } = evt;
    await db.insert(users).values({
<<<<<<< HEAD
      clerk_Id: data.id,
=======
      clerkId: data.id,
>>>>>>> 9f21a4b (internal structure improvements)
      name: `${data.first_name} ${data.last_name}`,
      imageUrl: data.image_url,
    });
  }

  if (eventType === "user.deleted") {
    const { data } = evt;
<<<<<<< HEAD
    if (!data.id) {
      return new Response("Error: Missing user ID", {
        status: 400,
      });
    }
    await db.delete(users).where(eq(users.clerk_Id, data.id));
  }
=======

    if (!data.id) {
      return new Response("Missing user id", { status: 400 });
    }
    await db.delete(users).where(eq(users.clerkId, data.id));
  }

>>>>>>> 9f21a4b (internal structure improvements)
  if (eventType === "user.updated") {
    const { data } = evt;

    await db
      .update(users)
      .set({
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      })
<<<<<<< HEAD
      .where(eq(users.clerk_Id, data.id));
    // }
  }
=======
      .where(eq(users.clerkId, data.id));
  }

>>>>>>> 9f21a4b (internal structure improvements)
  return new Response("Webhook received", { status: 200 });
}
