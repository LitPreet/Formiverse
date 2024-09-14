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

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const mutation = useMutation({
    mutationFn: (data: FormData) => loginUser(data),
    onSuccess: (data) => {
      // Handle success, e.g., show a success message or redirect
      console.log("Registration successful", data);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
      console.error("Registration error", error);
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
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
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={mutation.isLoading}>{`${
          true ? <Loading /> : "Submit"
        }`}</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
