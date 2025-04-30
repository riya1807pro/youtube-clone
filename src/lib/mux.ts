<<<<<<< HEAD
import Mux  from "@mux/mux-node";

export const mux = new Mux({
    tokenId : process.env.MUX_TOKEN_ID,
    tokenSecret : process.env.MUX_TOKEN_SECRET
})
=======
import Mux from "@mux/mux-node";

export const mux = new Mux({
  tokenId: process.env.MUX_ACCESS_TOKEN!,
  tokenSecret: process.env.MUX_SECRET_KEY!,
});
>>>>>>> 9f21a4b (internal structure improvements)
