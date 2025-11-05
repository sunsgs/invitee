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

export const inviteSchema = z.object({
  title: z.string().optional(),
  name: z.string().min(3, "name of the event is mandatory"),
  datetime: z.string().min(1, "Date and time are required"), // ISO string
  location: z.string().optional(),
  description: z.string().optional(),
  maxGuests: z.number(),
  maxGuestsBaby: z.number().optional(),
  rsvpRequired: z.boolean().default(false).optional(),
  bgColor: z.string().min(1, "Background color required"),
  fontValue: z.string().min(1, "Font required"),
  textColor: z.string().min(1, "Text color required"),
  emoji: z.string().optional(),
  emojiDensity: z.number().optional(),
});

export type InvitationCardData = Pick<
  InviteFormData,
  "title" | "name" | "datetime" | "location"
>;

// Type aliases for inferred types
export type SignupFormData = z.infer<typeof SignupFormSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
export type InviteFormData = z.infer<typeof inviteSchema>;
