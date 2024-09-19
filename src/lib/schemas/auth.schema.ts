import { z } from "zod";

// Define the schema for the registration form
export const registerFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "name must be at least 2 characters." })
    .max(30, { message: "Username must not exceed 30 characters." }),

  email: z
    .string()
    .email({ message: "Invalid email address." }),

  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(100, { message: "Full name must not exceed 100 characters." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(50, { message: "Password must not exceed 50 characters." })
    .regex(/[a-z]/, { message: "Password must include at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter." })
    .regex(/\d/, { message: "Password must include at least one number." })
    .regex(/[\W_]/, { message: "Password must include at least one special character." }),
  // avatar: z
  //   .instanceof(File)
  //   .refine((file) => file.type.startsWith("image/"), {
  //     message: "Avatar must be an image file.",
  //   }),
});

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "name must be at least 2 characters." })
    .max(30, { message: "Username must not exceed 30 characters." }),

  email: z
    .string()
    .email({ message: "Invalid email address." }),

  password: z
    .string()
    .min(1, { message: "Password is required." })
});