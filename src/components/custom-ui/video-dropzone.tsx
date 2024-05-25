"use client"
import { CloudDownload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, {useCallback, useState} from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'

const VideoDropzone = () => {
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('VideoDropzone')

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      switch (error.code) {
        case 'file-too-large':
          setError(t('errors.file-too-large'));
          break;
        case 'file-invalid-type':
          setError(t('errors.file-invalid-type'));
          break;
        case 'too-many-files':
          setError(t('errors.too-many-files'));
          break;
        default:
          setError(error.message);
      }
    } else {
      setError(null);
    }

    const video = acceptedFiles[0]
    if (video) {
        const formData = new FormData()
        formData.append('video', video)
        console.log(formData.get('video'));
    }

  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop, 
    maxFiles: 1, 
    maxSize: 734003200, 
    accept: {
      'video/*': []
    }
  })

  return (
    <div {...getRootProps()} className="border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer b"> 
      <input {...getInputProps()} />
      <div className="min-h-[100px]">
        {
            isDragActive ?
            <div className="grid place-items-center min-h-[100px]">
                <CloudDownload className="w-10 h-10 text-gray-500" />
                <p>Перетащите ваше видео сюда...</p>
            </div> :
            <div className="flex flex-col gap-2 text-center">
                <p>{t('instructions.dragAndDrop')}</p>
                <p className="text-sm text-gray-500">{t('instructions.supportedFormats')}</p>
                <p className="text-sm text-gray-500">{t('instructions.maxFileSize')}</p>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        }
      </div>
    </div>
  )
}

export default VideoDropzone