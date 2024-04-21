'use client';

import {useDropzone} from "react-dropzone";

const fileDropzone = () => {
    const { getRootProps, getInputProps, isDragActive, acceptedFiles }  = useDropzone({});

    return (
        <div {...getRootProps({className: "dropzone"})}>
            <input className="input-zone" {...getInputProps()} />
            <div className="text-center">
                {isDragActive ? (
                    <p className="dropzone-content">
                        Release to drop the files here
                    </p>
                ) : (
                    <p className="dropzone-content">
                        Drag’n’drop some files here, or click to select files
                    </p>
                )}
                <button type="button" className="btn">
                    Click to select files
                </button>
            </div>
            <aside>
            </aside>
        </div>
    )
}

