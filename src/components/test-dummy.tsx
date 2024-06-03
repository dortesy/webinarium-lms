'use client'

import TestToast from "./test-toast";
import Tiptap from "./text-rich-editor";
import Lottie from 'react-lottie';
import * as animationData from '../animations/studying.json'

const TestDummy = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <>
        <div>
            <Lottie options={defaultOptions}
                    height={400}
                    width={400}/>
        </div>
        <Tiptap />

        <TestToast />
        </>
    )
}

export default TestDummy;