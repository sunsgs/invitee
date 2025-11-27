import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: integer("banned", { mode: "boolean" }).default(false),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires", { mode: "timestamp_ms" }),
  isAnonymous: integer("is_anonymous", { mode: "boolean" }),
  subscriptionTier: text("subscription_tier").default("free").notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp_ms",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp_ms",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const invite = sqliteTable("invite", {
  id: text("id").primaryKey(),
  title: text("title"),
  name: text("name").notNull(), // required
  date: integer("date", { mode: "timestamp_ms" }).notNull(), // stores milliseconds precision timestamp (Date object)
  startTime: text("startTime"),
  endTime: text("endTime"),
  location: text("location"), // optional
  description: text("description"), // optional
  isMaxGuestsCountEnabled: integer("is_max_guests_count_enabled", {
    mode: "boolean",
  })
    .default(false)
    .notNull(),
  isBabyCountEnabled: integer("is_baby_count_enabled", { mode: "boolean" })
    .default(false)
    .notNull(),
  maxGuestsNumber: integer("max_guests"),
  maxGuestsBabyNumber: integer("max_guests_baby"), // optional
  rsvpRequired: integer("rsvp_required", { mode: "boolean" })
    .default(false)
    .notNull(),
  bgColor: text("bg_color").notNull(),
  fontValue: text("font_value").notNull(),
  textColor: text("text_color").notNull(),
  iconId: text("iconId"), // optional

  creatorId: text("creator_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const rsvp = sqliteTable("rsvp", {
  id: text("id").primaryKey(),
  inviteId: text("invite_id")
    .notNull()
    .references(() => invite.id, { onDelete: "cascade" }),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email"), // optional
  guestPhone: text("guest_phone"), // optional
  status: text("status", { enum: ["attending", "not_attending", "maybe"] })
    .notNull()
    .default("attending"),
  adultsCount: integer("adults_count").notNull().default(1),
  babiesCount: integer("babies_count").notNull().default(0),
  notes: text("notes"), // optional notes from guest
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Rsvp = typeof rsvp.$inferSelect;
export type NewRsvp = typeof rsvp.$inferInsert;

// Type exports
export type User = typeof user.$inferSelect;

export const schema = { user, account, session, verification, invite };
