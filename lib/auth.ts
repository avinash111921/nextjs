import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConnectDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions : NextAuthOptions = {
    providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith@gmail.com" },
            password: { label: "Password", type: "password" }
        },

        async authorize(credentials) {
            if(!credentials?.email || !credentials?.password) {
                throw new Error("Email and password are required");
            }

            try {
                ConnectDB();
                const user = await User.findOne({ email: credentials.email });
                if(!user) {
                    throw new Error("User not found");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if(!isValid) {
                    throw new Error("Invalid password");
                }

                return { 
                    id: user._id.toString(), 
                    email: user.email 
                };

            } catch (error) {
                console.error("Authorization error:", error);
                throw error
            }
        }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
        // If user is defined, it means the user has just logged in
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({session , token}) {
        // If user is defined, it means the user has just logged in
      if (session.user) {
        session.user.id = token.id as string; // Ensure id is a string
      }
      return session;
    },
  },
  pages : {
    signIn: "/login",
    error: "/login", // Error page URL
  },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
} 