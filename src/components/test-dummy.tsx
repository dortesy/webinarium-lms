'use client'

import TestToast from "./test-toast";
import Tiptap from "./text-rich-editor";

const TestDummy = () => {
    console.log('Dummy Render')
    return (
        <>
        <div>
            Test Dummy
        </div>
        <Tiptap />

        <TestToast />
        </>
    )
}

export default TestDummy;