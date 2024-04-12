import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server";
import { auth } from "@/auth";




const handler = async (req: Request) => {

    const session = await auth();

   return fetchRequestHandler(
        {
            endpoint: "/api/trpc",
            req,
            router: appRouter,
            createContext: () => ({session}),
        });
}



export { handler as GET, handler as POST };