import { ConnectDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
       const  {email,password} = await request.json();

       if(!email || !password){
        return NextResponse.json({error: "Email and password are required"}, {status: 400});
       }

        await ConnectDB();

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        await User.create({email,password});

        return NextResponse.json(
            {message: "User created successfully"},
            {status: 201}
        );

    } catch (error) {
        return NextResponse.json(
            {error: "Registration failed. Internal Server Error"},
            {status: 500}
        );
    }
}