
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { randomBytes } from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/Users";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day session lifetime
  },
  callbacks: {
    async jwt({ token, user }) {

      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.role = user.role;
        token.isVerified = user.isVerified;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub,
        name: token.name,
        role: token.role,
        isVerified: token.isVerified,
      };
      return session;
    },
    async signIn({ user, profile }) { 
      try { 
        await dbConnect(); 
        const email = profile?.email; const firstName = (profile as any)?.given_name || ""; 
        const lastName = (profile as any)?.family_name || ""; 
        
        if (!email) { 
          console.error("No email found in Google profile"); 
          return false; 
        } 
        
        const [existingUserResult, lastUserResult] = await Promise.allSettled([ 
          User.findOne({ email }), 
          User.findOne(),
        ]); 
        const existingUser = existingUserResult.status === "fulfilled" ? existingUserResult.value : null; 
        const lastUser = lastUserResult.status === "fulfilled" ? lastUserResult.value : null; 
        // console.log({email, existingUser, lastUser});
        
        if (!existingUser && !lastUser) { 
         

          const newUser = await User.create({ 
            email,
            name: `${firstName} ${lastName}`, 
            isVerified: true, 
            password: randomBytes(16).toString("hex"), 
            role:'admin',
          }); 

          user.id = newUser._id.toString(); 
          user.name = newUser.name; 
          user.email = newUser.email; 
          user.isVerified = newUser.isVerified; 
          user.role = newUser.role;
          
          
        } 
        else {
          
         
          user.id = existingUser._id.toString(); 
          user.name = existingUser.name; 
          user.email = existingUser.email; 
          user.isVerified = existingUser.isVerified; 
          user.role = existingUser.role; 

          
        } 
        return true; 
      } catch (error) { 
        // await Error_Logs(NextRequest,"PLAYER_ERROR_GOOGLE_SIGN_IN", error, null);
        console.error("Error in signIn callback:", error); 
        return false; 
      } 
    },
    async redirect({ url, baseUrl }) {

      return `${baseUrl}/admin`;
    },

  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
