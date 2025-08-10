import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import LinkedInProvider from 'next-auth/providers/linkedin';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users, linkedinVerifications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password Authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!user) {
            throw new Error('User not found');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            isVerified: user.isVerified,
            avatar: user.avatar,
            institute: user.institute,
            graduationYear: user.graduationYear,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Authentication failed');
        }
      }
    }),

    // LinkedIn OAuth for Alumni Verification
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'r_liteprofile r_emailaddress',
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.institute = user.institute;
        token.graduationYear = user.graduationYear;
      }

      // Handle LinkedIn sign-in for verification
      if (account?.provider === 'linkedin' && profile) {
        try {
          // Check if user exists
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, token.email!))
            .limit(1);

          if (existingUser) {
            // Store LinkedIn verification data
            await db.insert(linkedinVerifications).values({
              userId: existingUser.id,
              linkedinProfile: `https://linkedin.com/in/${(profile as any).vanityName || profile.id}`,
              linkedinData: profile,
              status: 'pending',
            });

            token.linkedinVerificationPending = true;
          }
        } catch (error) {
          console.error('LinkedIn verification error:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.institute = token.institute as string;
        session.user.graduationYear = token.graduationYear as number;
        session.user.linkedinVerificationPending = token.linkedinVerificationPending as boolean;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Allow all credential sign-ins
      if (account?.provider === 'credentials') {
        return true;
      }

      // Handle LinkedIn sign-in
      if (account?.provider === 'linkedin') {
        // Only allow LinkedIn sign-in for existing users (for verification)
        try {
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);

          return !!existingUser;
        } catch (error) {
          console.error('Sign-in check error:', error);
          return false;
        }
      }

      return true;
    },
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};