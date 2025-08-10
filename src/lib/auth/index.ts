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
          if (!db) {
            throw new Error('Database not configured');
          }
          
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
        token.role = (user as any).role;
        token.isVerified = (user as any).isVerified;
        token.institute = (user as any).institute;
        token.graduationYear = (user as any).graduationYear;
      }

      // Handle LinkedIn sign-in for verification
      if (account?.provider === 'linkedin' && profile) {
        try {
          if (!db) {
            return token;
          }
          
          // Check if user exists
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, token.email!))
            .limit(1);

          if (existingUser) {
            // Store LinkedIn verification data with proper typing
            const linkedinProfile = profile as any;
            const profileUrl = linkedinProfile.vanityName 
              ? `https://linkedin.com/in/${linkedinProfile.vanityName}`
              : linkedinProfile.id 
                ? `https://linkedin.com/in/${linkedinProfile.id}`
                : 'https://linkedin.com/';

            await db.insert(linkedinVerifications).values({
              userId: existingUser.id,
              linkedinProfile: profileUrl,
              linkedinData: profile,
              status: 'pending',
            }).onConflictDoNothing();

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
        (session.user as any).id = token.sub!;
        (session.user as any).role = token.role as string;
        (session.user as any).isVerified = token.isVerified as boolean;
        (session.user as any).institute = token.institute as string;
        (session.user as any).graduationYear = token.graduationYear as number;
        (session.user as any).linkedinVerificationPending = token.linkedinVerificationPending as boolean;
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
          if (!db) {
            return false;
          }
          
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
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};