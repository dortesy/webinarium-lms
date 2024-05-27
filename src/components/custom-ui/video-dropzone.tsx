"use client"
import { CloudDownload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, {useCallback, useState} from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import { Progress } from "@/components/ui/progress"
import { Button } from '../ui/button'
import { LessonWithVideo } from '@/lib/types/course'

interface VideoDropzoneProps {
    lessonId: string;
    sectionId: string;
    onVideoUpload: (updatedLesson: LessonWithVideo) => void;
}

const VideoDropzone = ({ lessonId, sectionId, onVideoUpload }: VideoDropzoneProps) => {
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('VideoDropzone')
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [xhrInstance, setXhrInstance] = useState<XMLHttpRequest | null>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('video', file);
    formData.append('lessonId', lessonId);
    formData.append('sectionId', sectionId);
  
    setUploading(true);
    setProgress(0);
  
    const xhr = new XMLHttpRequest();
    setXhrInstance(xhr);
    xhr.open('POST', '/api/upload/video', true);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded * 100) / event.total));
      }
    };
  
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
        setUploading(false);
        setProgress(100);
        onVideoUpload(data);
      } else {
        console.error('Upload failed');
        setUploading(false);
        setProgress(0);
      }
    };
  
    xhr.onerror = () => {
      console.error('Upload failed');
      setUploading(false);
      setProgress(0);
    };
  
    xhr.onabort = () => {
      console.log('Upload aborted');
      setUploading(false);
      setProgress(0);
    };
  
    xhr.send(formData);
  };

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
        setFile(video);
        handleUpload(video);
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

  const handleAbort = () => {
    if (xhrInstance) {
      xhrInstance.abort();
    }
  };

  return (
    <div>
      {!uploading ? (
        <div {...getRootProps()} className="border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-700">
          <input {...getInputProps()} />
          <div className="min-h-[100px]">
            {isDragActive ? (
              <div className="grid place-items-center min-h-[100px]">
                <CloudDownload className="w-10 h-10 text-gray-500" />
                <p>{t('instructions.activeDrag')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-center">
                <p>{t('instructions.dragAndDrop')}</p>
                <p className="text-sm text-gray-500">{t('instructions.supportedFormats')}</p>
                <p className="text-sm text-gray-500">{t('instructions.maxFileSize')}</p>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            )}
            </div>
            </div>
       ) : (
        <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-lg">

            <div className="flex flex-col gap-2 items-center">
                <p className="text-sm font-light">{t('instructions.uploading')}</p>
                <p className="text-lg font-semibold"> {file?.name}</p>
            </div>
            <div className="w-full flex flex-row items-center gap-2">
            <Progress value={progress} /> <p className="text-sm font-light">{progress}%</p>
          </div>
          <Button onClick={handleAbort} variant="destructive">
            {t('instructions.cancelUpload')}
          </Button>
          
        </div>
      )}
    </div>
  )
}

export default VideoDropzone