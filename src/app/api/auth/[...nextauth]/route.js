// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        role: { label: "Role", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const users = [
          {
            role: "admin",
            email: "admin@stockmaster.com",
            password: "admin123",
          },
          {
            role: "staff",
            email: "staff@stockmaster.com",
            password: "staff123",
          },
          {
            role: "manager",
            email: "manager@stockmaster.com",
            password: "manager123",
          },
        ];

        const user = users.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password &&
            u.role === credentials.role
        );

        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
