import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { registerFormSchema } from "@/lib/schemas/auth.schema";
import { useMutation } from "react-query";
import { registerUser } from "@/api/auth";
import { Loading } from "../loader/Loader";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import OTPForm from "./OTPForm";
import { useNavigate } from "react-router-dom";
import { useRoutePath } from "@/hooks/useRoutePath";

export function RegisterForm() {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  });
   const navigate = useNavigate()
   const path = useRoutePath()
  const mutation = useMutation({
    mutationFn: (data: FormData) => registerUser(data),
    onSuccess: (data) => {
      // Handle success, e.g., show a success message or redirect
      console.log("Registration successful", data);
      setShowOTPForm(!showOTPForm);
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
      console.error("Registration error", error);
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    // Create a new FormData object
    const formData = new FormData();
  
    // Append each form field to the FormData
    formData.append('username', values.username);
    formData.append('fullName', values.fullName);
    formData.append('email', values.email);
    formData.append('password', values.password);

    // Use your mutation function to send the FormData to your API
    try {
     const data =  await registerUser(formData); // The mutation function should handle FormData
     localStorage.setItem('email',data?.data?.email)
     console.log(data)
      setShowOTPForm(!showOTPForm)
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
 
  return showOTPForm ? (<OTPForm />) : (
    <Form {...form}>
      <h1 className="text-center font-bold text-xl">Register for free</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 relative"
      >
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
     {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    className="w-full"
                  />
                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? <Loading /> : "Submit"}
        </Button>
      </form>
      <p className="text-sm mt-2">Already have an account ?<span className="text-primary mx-1 cursor-pointer" onClick={() => navigate(path.login)}>Sign in</span></p>
    </Form>
  );
}
