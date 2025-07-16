import { Connection } from "mongoose";

declare global {
    var mongoose : {
        conn : Connection | null;
        promise: Promise<Connection> | null;
    }
}

export {};

// when using TypeScript with Mongoose in a Next.js application.
// It ensures that the global mongoose connection is properly typed and initialized.