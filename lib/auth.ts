import { db } from "@/db";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      subscriptionTier: {
        type: "string",
        required: true,
        defaultValue: "free",
        input: false, // prevent users from setting this directly
      },
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["google", "facebook"],
    },
  },

  plugins: [admin()],
});
