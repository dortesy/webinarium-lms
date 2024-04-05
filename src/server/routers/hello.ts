import { router, publicProcedure } from "@/server/trpc";
import { z } from "zod";
export const helloRouter = router({
    greeting: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),


});
