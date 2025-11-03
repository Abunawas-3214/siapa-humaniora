import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // Extend the default user type
  interface User extends DefaultUser {
    id: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
  }

  // Extend the session type
  interface Session {
    user: {
      id: string;
      isAdmin?: boolean;
      isSuperAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
  }
}
