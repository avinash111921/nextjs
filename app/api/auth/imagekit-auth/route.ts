// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {

    // For example, you can check if the user is logged in or has the necessary permissions
    // If the user is not authenticated, you can return an error response

    try {
        const authenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
        })
    
        return Response.json({ authenticationParameters, publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY })
    } catch (error) {
        return Response.json(
            { error: "Failed to get upload authentication parameters" },
            { status: 500 }
        )
    }
}