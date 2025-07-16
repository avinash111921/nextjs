import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function ConnectDB() {
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise) {  // if there is no promise, connect to the database

        const opts = {
            bufferCommands: true,  // Disable mongoose's buffering of commands
            maxPoolSize: 10,  // Adjust the maximum number of connections in the pool
        };

        mongoose
        .connect(MONGODB_URI)
        .then(() => mongoose.connection)
    }
    try {
        cached.conn =await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;  // reset the promise if connection fails
        throw error;  // rethrow the error for handling
    }
    return cached.conn;
}