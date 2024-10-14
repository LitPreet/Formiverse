import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useMutation } from "react-query";
import { useToast } from "@/hooks/use-toast";
import { forgotPasswordSendOtp } from "@/api/auth";
import { useState } from "react";
import ResetPassword from "./ResetPassword";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

const ForgotPasswordForm = () => {
  const [showVerifyPassword, setShowVerifyPassword] = useState(() => {
    const savedState = localStorage.getItem("showVerifyPassword");
    return savedState ? JSON.parse(savedState) : false;
  });
  const { toast } = useToast();

  // Handle changes to showVerifyPassword and update localStorage
  const handleShowVerifyPassword = (value: boolean) => {
    setShowVerifyPassword(value);
    localStorage.setItem("showVerifyPassword", value.toString());
  };

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (email: string) => forgotPasswordSendOtp({ email }), // Replace with your actual API call
    onSuccess: () => {
      toast({
        description: "An OTP has been sent to your email for password reset.",
      });
      handleShowVerifyPassword(true);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: error?.data?.message || "Something went wrong!",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    localStorage.setItem("emailForOTP", values.email);
    mutation.mutate(values.email);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {showVerifyPassword ? (
        <ResetPassword />
      ) : (
        <div className="max-w-md w-full mx-3 sm:mx-0 h-60 border dark:border-gray-200 border-gray-500  rounded-md flex flex-col items-center justify-center px-6">
          <Form {...form}>
            <h1 className="text-center font-bold text-xl  dark:text-white text-gray-700">
              Forgot Password
            </h1>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 flex flex-col w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="border border-gray-400 text-black dark:text-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center">
                <Button type="submit" className="w-1/2">
                  send Otp
                  {/* {mutation.isLoading ? "Sending..." : "Send OTP"} */}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
