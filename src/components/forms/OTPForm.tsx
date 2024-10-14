import { verifyOTP } from "@/api/auth";
import { OTP } from "@/lib/types/auth";
import React, { MutableRefObject, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Loading } from "../loader/Loader";
import { setCredentials } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";

const OTPForm = () => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const inputRefs: MutableRefObject<HTMLInputElement[]> = useRef([]);
  const navigate = useNavigate();
  const {toast} = useToast()
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const email = localStorage.getItem("email");
  const dispatch = useDispatch();
  
  const mutation = useMutation({
    mutationFn: (data: OTP) => verifyOTP(data),
    onSuccess: (data) => {
      const { accessToken, user } = data.data;
      const { username, email, fullName } = user;
      dispatch(
        setCredentials({
          accessToken,
          user: { username, email, fullName },
        })
      );
      navigate(from, { replace: true });
      localStorage.setItem("authenticated", "true");
    },
    onError: (error:any) => {
      toast({
        variant: "destructive",
        description: `${error?.data?.message}`,
      });
      // Handle error, e.g., show an error message
      console.error("Registration error", error);
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
    if (otp.some((val) => val === "")) {
      // Handle incomplete OTP input
      alert("Please fill in all OTP fields");
      return;
    }
    const data = {
      email: email,
      otp: otp.join(""),
    };
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center w-full justify-start">
      <h1 className="text-center font-bold text-2xl my-5">Verification code</h1>
      <p className="text-gray-500 text-center">
        An 4 digit code has been sent to your email preetb0gmail.com
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
        <Button disabled={mutation.isLoading || otp.length < 3}>
          {mutation.isLoading ? <Loading /> : "Verify"}
        </Button>
      </form>
    </div>
  );
};

export default OTPForm;
