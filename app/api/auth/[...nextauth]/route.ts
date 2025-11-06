import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // 🔹 Prisma Adapter (store sessions & accounts in DB)
  adapter: PrismaAdapter(prisma),

  // 🔹 Store sessions in the DB (not just JWT)
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  // 🔹 Add Credential Provider for email/password login
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Compare hashed passwords
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user data (this will be encoded in the session)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // 🔹 Customize JWT/session callbacks
  callbacks: {
    async signIn({ user, account, profile }) {
      // If the login attempt is via Google
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Reject login if email not found
          console.log("❌ Google account not linked: ", user.email);
          return false;
        }

        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            // Update the image using the URL provided by NextAuth's 'user' object
            image: user.image,
            // Set emailVerified since Google provides a verified email
            emailVerified: existingUser.emailVerified ?? new Date(),
            // Optionally update the name if it's missing or different: name: user.name,
          },
        });

        // If found, link Google account to existing user automatically
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: "google",
              providerAccountId: account.providerAccountId,
            },
          },
          update: {},
          create: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            token_type: account.token_type,
            id_token: account.id_token,
          },
        });
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      // When the user signs in with Google
      if (account?.provider === "google" && profile){
        token.picture = (profile as any).picture;
      }

      if (user) {
        token.id = user.id;
        token.isAdmin = (user as any).isAdmin;
        token.isSuperAdmin = (user as any).isSuperAdmin;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin;
        session.user.isSuperAdmin = token.isSuperAdmin;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },

  // 🔹 Optional: Custom pages
  pages: {
    signIn: "/login", // You can make your own login page
  },
};

// Default export for Next.js App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
