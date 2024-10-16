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
import { Eye, EyeOff } from "lucide-react";
import { setCredentials } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRoutePath } from "@/hooks/useRoutePath";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const { toast } = useToast();
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
  const path = useRoutePath();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location?.state?.from?.pathname || "/";

  const mutation = useMutation({
    mutationFn: (data: LoginUser) => loginUser(data),
    onSuccess: (data: any) => {
      const { accessToken, user } = data.data;
      const { username, email, fullName } = user;
      dispatch(
        setCredentials({ accessToken, user: { username, email, fullName } })
      );
      navigate(from, { replace: true });
      localStorage.setItem("authenticated", "true");
    },
    onError: (error: any) => {
      // Handle error, e.g., show an error message
      toast({
        variant: "destructive",
        description: `${error?.data?.message || "something went wrong!"}`
      });
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

  const handleGuestLogin = () => {
    const guestData = {
      username: import.meta.env.VITE_GUEST_USERNAME,
      password: import.meta.env.VITE_GUEST_PASS,
      email: import.meta.env.VITE_GUEST_EMAIL,
    };
    form.setValue("username", guestData.username);
    form.setValue("email", guestData.email);
    form.setValue("password", guestData.password);
    onSubmit(guestData);
  };

  return (
    <Form {...form}>
      <h1 className="text-center font-bold text-xl dark:text-white text-gray-700">
        Login for free
      </h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input
                  className="border border-gray-400 text-black dark:text-gray-200"
                  placeholder="Enter your username"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
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
                <Input
                  type="email"
                  className="border border-gray-400 text-black dark:text-gray-200"
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
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
                    className="border border-gray-400 w-full text-black dark:text-gray-200"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <button
                    type="button"
                    name="eye"
                    onClick={handleTogglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-white text-black"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button name="submit" type="submit" disabled={mutation.isLoading} className="w-full">
          {mutation.isLoading ? <Loading /> : "Submit"}
        </Button>
        <p className="text-center dark:text-gray-300 text-gray-600">or</p>
        <Button
        name="loginbtn"
          type="button"
          onClick={handleGuestLogin}
          disabled={mutation.isLoading}
          className="w-full mt-2"
        >
          {mutation.isLoading ? <Loading /> : "Guest Login"}
        </Button>
        <p className="text-sm mt-2 dark:text-white text-gray-700">
          Forgot your password?
          <span
            className="text-primary font-semibold mx-1 cursor-pointer"
            onClick={() => navigate(path.forgotPassword)}
          >
            Reset it here
          </span>
        </p>
      </form>
      <p className="text-sm mt-2 dark:text-white text-gray-700">
        Don't have an account ?
        <span
          className="text-primary mx-1 font-semibold cursor-pointer"
          onClick={() => navigate(path.registerUser)}
        >
          Sign up
        </span>
      </p>
    </Form>
  );
};

export default LoginForm;
