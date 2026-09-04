import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db/prisma";
import { ensureMonthlyCredits } from "@/lib/billing/credits";
import {
  clearGuestSessionCookie,
  getExistingGuestIdFromCookie,
  promoteGuestResourcesToUser,
} from "@/lib/auth/guest-resources";
import bcrypt from "bcrypt";

async function migrateGuestResources(userId: string) {
  const guestId = await getExistingGuestIdFromCookie();
  if (!guestId) return;

  await promoteGuestResourcesToUser(guestId, userId);
  await clearGuestSessionCookie();
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        if (!user.isActive) {
          throw new Error("This account has been disabled");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          membershipType: user.membershipType,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        if (user.id) {
          await migrateGuestResources(user.id);
        }
        return true;
      }
      if (!user.email) return false;

      try {
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            avatar: user.image,
            emailVerified: new Date(),
            provider: "google",
            providerId: account.providerAccountId,
            lastLoginAt: new Date(),
            isActive: true,
          },
          create: {
            email: user.email,
            name: user.name,
            avatar: user.image,
            emailVerified: new Date(),
            provider: "google",
            providerId: account.providerAccountId,
            membershipType: "FREE",
            isActive: true,
            lastLoginAt: new Date(),
          },
        });

        await ensureMonthlyCredits(dbUser.id, dbUser.membershipType);
        await migrateGuestResources(dbUser.id);

        user.id = dbUser.id;
        user.membershipType = dbUser.membershipType;
        user.role = dbUser.role;
        return true;
      } catch (error) {
        console.error("[Auth] Google sign-in failed:", error);
        return false;
      }
    },
    async jwt({ token, user, trigger }) {
      // 用户首次登录时保存基本信息
      if (user) {
        token.id = user.id;
        token.membershipType = user.membershipType || "FREE";
        token.role = user.role || "USER";
      }
      
      // 当触发更新时或每次会话时,从数据库获取最新的membershipType
      if (trigger === "update" || !user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { membershipType: true, membershipExpiresAt: true, role: true },
          });
          
          if (dbUser) {
            token.membershipType = dbUser.membershipType;
            token.membershipExpiresAt = dbUser.membershipExpiresAt?.toISOString();
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error("[Auth] Failed to refresh membershipType:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.membershipType = (token.membershipType as string) || "FREE";
        session.user.role = (token.role as string) || "USER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
