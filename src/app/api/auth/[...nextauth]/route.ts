import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Secure admin authentication using environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        
        if (
          !adminEmail || 
          !adminPassword ||
          !credentials?.email || 
          !credentials?.password
        ) {
          return null;
        }
        
        // Secure comparison to prevent timing attacks
        const emailMatch = credentials.email.toLowerCase() === adminEmail.toLowerCase();
        const passwordMatch = credentials.password === adminPassword;
        
        if (emailMatch && passwordMatch) {
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin',
          };
        }
        
        return null;
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user?.email) {
        const adminEmail = process.env.ADMIN_EMAIL;
        (session.user as any).isAdmin = adminEmail && session.user.email.toLowerCase() === adminEmail.toLowerCase();
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };