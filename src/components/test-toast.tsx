'use client'
import TestDummy from "./test-dummy";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const TestToast = () => {
    const { toast } = useToast()

    return (
        <div>
            <Button onClick={() => toast({
                title: "Test Toast",
                description: "This is a test toast",
                type: "foreground"
            })}>
                Test Toast
            </Button>
        </div>
    )
}

export default TestToast;