import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDb } from "./mongodb";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          console.log("NextAuth: Attempting database connection...");
          const db = await getDb();
          console.log("NextAuth: Connected. Searching for user:", credentials.email);
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (!user) {
            console.warn("NextAuth: User not found");
            return null;
          }

          console.log("NextAuth: User found, comparing password...");
          const isValid = bcrypt.compareSync(credentials.password, user.password);
          
          if (isValid) {
            console.log("NextAuth: Authentication successful");
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
          
          console.warn("NextAuth: Invalid password");
          return null;
        } catch (error) {
          console.error("NextAuth authorize error:", error.message);
          throw new Error("Internal authorization failure");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development" || true, // Enable for now to debug production
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", code, metadata);
    },
  },
});
