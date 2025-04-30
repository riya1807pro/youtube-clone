import { Ratelimit } from "@upstash/ratelimit";
<<<<<<< HEAD
import { redis } from "./redis";

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "10s"),
=======

import { redis } from "./redis";

export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
>>>>>>> 9f21a4b (internal structure improvements)
});
