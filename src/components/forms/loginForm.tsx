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
import { Input } from "../ui/input";
import { Loading } from "../loader/Loader";
import { loginFormSchema } from "@/lib/schemas/auth.schema";
import { useMutation } from "react-query";
import { loginUser } from "@/api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginUser } from "@/lib/types/auth";
import { useState } from "react";
import { Eye,EyeOff } from "lucide-react";
import { setCredentials } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()
  const from = location?.state?.from?.pathname || "/";

  const mutation = useMutation({
    mutationFn: (data:LoginUser) => loginUser(data),
    onSuccess: (data: any) => {
      console.log("Registration successful",data);
      const {accessToken, user} =data.data
      const {username, email, fullName} = user
      dispatch(setCredentials({ accessToken, user: {username, email, fullName} }));
      navigate(from, { replace: true });
      localStorage.setItem('authenticated', 'true');
    },
    onError: (error: any) => {
      // Handle error, e.g., show an error message
      console.error("Registration error", error);
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const formData = {
      username: values.username,
      password: values.password,
      email: values.email,
    };
    mutation.mutate(formData);
  }

  return (
    <Form {...form}>
      <h1 className="text-center font-bold text-xl">Login for free</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
    </Form>
  );
};

export default LoginForm;
