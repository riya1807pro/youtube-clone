import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type VideoGetOneOutput = 
inferRouterOutputs<AppRouter>["videos"]["getOne"];
//  todo : chnage to video.getMany

export type VideoGetManyOutput = 
inferRouterOutputs<AppRouter>["Suggestion"]["getMany"]