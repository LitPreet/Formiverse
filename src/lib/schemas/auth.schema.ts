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

export const formSchema = z.object({
  heading: z.string().min(5, {
    message: "Heading must be at least 5 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }).default(""),
  questions: z
    .array(
      z.object({
        _id: z.string().optional(),
        questionText: z.string().min(5, {
          message: "Question must be at least 5 characters.",
        }),
        questionDescription: z.string().optional().default(""),
        questionType: z.string().optional(),
        options: z
          .array(z.string())
          .optional(),
        required: z.boolean().optional().default(false),
      })
    )
    .optional(),
})
  .refine((data) => {
    const errors: z.ZodIssue[] = []; // Array to collect error messages

    // Check each question in the questions array for conditional validation
    data.questions?.forEach((question, questionIndex) => {
      const { questionType, options } = question;
      const requiresOptions = ["mcq", "checkbox", "dropdown"].includes(
        questionType || ""
      );

      if (requiresOptions) {
        if (!options || options.length < 1) {
          // Collect error for missing options
          errors.push({
            code: z.ZodIssueCode.custom,
            message: "At least 2 options are required for MCQ, checkbox, and dropdown types.",
            path: [`questions`, questionIndex],// Use a general path for this error
          });
        }
        options && options.forEach((option, emptyOptionIndex) => {
          if (option.trim().length === 0) {
            // Collect error for empty options
            errors.push({
              code: z.ZodIssueCode.custom,
              message: "Each option must have at least 1 character.",
              path: [`questions`, questionIndex],
            });
          }
        });
      }
    });

    if (errors.length > 0) {
      // Throw a consolidated error message if any errors were collected
      throw new z.ZodError(errors);
    }

    return true; // Return true if no errors
  });

export type FormSchema = z.infer<typeof formSchema>;