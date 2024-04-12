import {router, publicProcedure, teacherProcedure} from "@/server/trpc";
import { z } from "zod";
export const helloRouter = router({
    greeting: teacherProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),


});
