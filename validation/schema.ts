import { invite } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

// Reusable password schema with minimum length validation
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });

// Utility function to check if password and confirmPassword match
const passwordMatch = (field: string) => (data: any) =>
  data.password === data[field];

// Login form schema
export const LoginFormSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }),
    password: passwordSchema,
  })
  .strict();

// Signup form schema with confirmPassword validation
export const SignupFormSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }),
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordMatch("confirmPassword"), {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .strict();

// Change password schema with current password and confirmPassword validation
export const ChangePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
    currentPassword: passwordSchema,
  })
  .refine(passwordMatch("confirmPassword"), {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .strict();

// export const inviteSchema = z.object({
//   id: z.string().optional(),
//   title: z.string().transform((val) => val ?? undefined),
//   name: z.string().min(3, "name of the event is mandatory"),
//   date: z.date(),
//   startTime: z.string().optional(),
//   endTime: z.string().optional(),
//   location: z.string().optional(),
//   description: z.string().optional(),
//   isMaxGuestsCountEnabled: z.boolean().default(false).optional(),
//   isBabyCountEnabled: z.boolean().default(false).optional(),
//   maxGuestsNumber: z.number().optional(),
//   maxGuestsBabyNumber: z.number().optional(),
//   rsvpRequired: z.boolean().default(false).optional(),
//   bgColor: z.string().min(1, "Background color required"),
//   fontValue: z.string().min(1, "Font required"),
//   textColor: z.string().min(1, "Text color required"),
//   emoji: z.string().optional(),
//   emojiDensity: z.number().optional(),
// });
// .refine(
//   (data) => {
//     if (data.startTime && data.endTime) {
//       const dateOnly = data.date.split("T")[0]; // "2025-11-24"
//       const start = new Date(`${dateOnly}T${data.startTime}`);
//       const end = new Date(`${dateOnly}T${data.endTime}`);
//       return end > start;
//     }
//     return true; // If either is missing, skip validation
//   },
//   {
//     message: "End time must be after start time",
//     path: ["endTime"], // This will show the error on the endTime field
//   }
// );

export const inviteSchemaDB = createInsertSchema(invite);

export const inviteSchema = inviteSchemaDB.extend({
  id: z.string().optional(),
  creatorId: z.string().optional(),
  name: inviteSchemaDB.shape.name.min(3, {
    message: "Name must be at least 3 characters",
  }),
});

// Type aliases for inferred types
export type SignupFormData = z.infer<typeof SignupFormSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
export type InviteFormData = z.infer<typeof inviteSchema>;

export type InvitationCardData = Pick<
  InviteFormData,
  "title" | "name" | "date" | "location" | "startTime" | "endTime"
>;
