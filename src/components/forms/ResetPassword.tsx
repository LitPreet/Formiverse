import { verifyforgotPasswordSendOtp } from "@/api/auth";
import React, { MutableRefObject, useRef, useState } from "react";
import { useMutation } from "react-query";
import {  useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Loading } from "../loader/Loader";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";

type MutationData = {
  email: string;
  otp: string;
  newPassword: string;
};

const ResetPassword = () => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [password, setShowPassword] = useState<string>("");
  const inputRefs: MutableRefObject<HTMLInputElement[]> = useRef([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const email = localStorage.getItem("emailForOTP");

  const mutation = useMutation({
    mutationFn: (data: MutationData) => verifyforgotPasswordSendOtp(data),
    onSuccess: () => {
      localStorage.removeItem("showVerifyPassword");
      localStorage.removeItem("emailForOTP");
      toast({
        variant: "default",
        description: "Password changed successfully!",
      });
      navigate("/login"); // Redirect after successful password reset
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: `${error?.data?.message || "Something went wrong"}`,
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const value = e.target.value;
    if (isNaN(+value)) return;
    const newOtp = [...otp];
    newOtp[i] = value.substring(value.length - 1);
    if (value && i < 3 && inputRefs.current[i + 1]) {
      inputRefs.current[i + 1].focus();
    }
    setOtp(newOtp);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1].focus();
    }
  };
  const handleClick = (i: number) => {
    inputRefs.current[i].setSelectionRange(1, 1);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (otp.some((val) => val === "" || !password)) {
      toast({
        variant: "destructive",
        description: "Please fill in all fields!",
      });
      return;
    }
    const data: MutationData = {
      email: email!,
      otp: otp.join(""),
      newPassword: password,
    };
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md w-full py-4 border dark:border-gray-200 border-gray-500 rounded-md flex flex-col items-center justify-center px-6">
      <h1 className="text-center font-bold text-2xl my-5 text-gray-600 dark:text-gray-200">
        Verification code
      </h1>
      <p className="text-gray-500 dark:text-gray-200  text-sm text-center">
        {`An 4 digit code has been sent to your email ${email || ""}`}
      </p>
      <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
        <div className="flex">
          {otp.map((_, i: number) => {
            return (
              <input
                key={i}
                className="w-10 h-10 m-2 text-center outline-none focus:border-blue-400 border-2 text-md"
                type="text"
                autoFocus={i === 0}
                ref={(input) => {
                  if (input) {
                    inputRefs.current[i] = input;
                  }
                }}
                maxLength={1}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onClick={() => handleClick(i)}
              />
            );
          })}
        </div>
        <Input
          className="border border-gray-400 text-black dark:text-gray-200"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setShowPassword(e.target.value)}
        />
        <Button disabled={mutation.isLoading || otp.length < 3}>
          {mutation.isLoading ? <Loading /> : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
