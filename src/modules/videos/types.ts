import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

<<<<<<< HEAD
export type VideoGetOneOutput = 
inferRouterOutputs<AppRouter>["videos"]["getOne"];
//  todo : chnage to video.getMany

export type VideoGetManyOutput = 
inferRouterOutputs<AppRouter>["Suggestion"]["getMany"]
=======
export type VideoGetOneOutPut =
  inferRouterOutputs<AppRouter>["videos"]["getOne"];

export type VideoGetManyOutput =
  inferRouterOutputs<AppRouter>["suggestions"]["getMany"];
>>>>>>> 9f21a4b (internal structure improvements)
