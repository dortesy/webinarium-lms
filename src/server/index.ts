import {authRouter} from "./routers/auth";
import {helloRouter} from "@/server/routers/hello"
import { router } from "./trpc";

export const appRouter = router({
    hello: helloRouter,
    authRouter: authRouter,
});

export type AppRouter = typeof appRouter;