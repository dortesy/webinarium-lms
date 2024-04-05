'use client'
import { trpc } from "@/server/client";

export default function Home() {
    const hello = trpc.hello.greeting.useQuery({ text: "from tRPC" });
    if (!hello.data) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1>{hello.data.greeting}</h1>
        </div>
    );
}
