"use client"

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import React, { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess : (res : any) => void
    onProgress? : (progress : number) => void
    fileType?:"image" | "video"
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
} : FileUploadProps) => {

    const [uploading, setUploading] = useState(false);
    const [error,setError] = useState<String | null>(null);

    //optional validation

    const validateFile = (file : File) => {
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError("Please upload a valid video file.");
            }
            if(file.size > 100*1024*1024){
                setError("Please upload a video file less than 100MB.");
            }
            return true;
        }
    }

    const handleFileChange = async (e : React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file){
            return;
        }
        if(!validateFile(file)){
            return;
        }
        setUploading(true);
        setError(null);
        try {
            const authRes = await fetch("/api/auth/imagekit-auth");
            const auth = await authRes.json();
            const res = await upload({
                file,
                fileName: file.name, 
                publicKey : process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature : auth.signature,
                expire : auth.expire,
                token : auth.token,
                onProgress: (event) => {
                    if(event.lengthComputable && onProgress){
                        const percent = Math.round((event.loaded / event.total) * 100);
                        onProgress(percent);
                    }
                },
            });
            onSuccess(res);
        } catch (error) {
            if(error instanceof ImageKitUploadNetworkError){
                setError(error.message);
            }else if(error instanceof ImageKitInvalidRequestError){
                setError(error.message);
            }else if(error instanceof ImageKitServerError){
                setError(error.message);
            }else if(error instanceof ImageKitAbortError){
                setError(error.message);
            }else{
                setError("Something went wrong. Please try again.");
            }
        }finally{
            setUploading(false);
        }
    }
    return (
        <>
            <input 
            type="file"
            accept={fileType === "video" ? "video/*" : "image/*"}
            onChange={handleFileChange}
            />
            {uploading && <div>Uploading...</div>}
            {error && <div>{error}</div>}

        </>
    );
};

export default FileUpload;