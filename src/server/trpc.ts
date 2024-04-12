import {initTRPC, TRPCError} from "@trpc/server";
import {CreateNextContextOptions} from "@trpc/server/adapters/next";
import {auth} from "@/auth";
import {ZodError} from "zod";
import superjson from "superjson";

export const createTRPCContext = async (opts: CreateNextContextOptions) => {

    // Get the session from the server using the getServerSession wrapper function
    const session = await auth(opts.req, opts.res);
    return { session }
};



const t = initTRPC.context<typeof createTRPCContext>().create();


//const t = initTRPC.create();




export const router = t.router;
export const publicProcedure = t.procedure;

export const teacherProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user || !ctx.session.user.isVerified) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    console.log(ctx.session)
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});


