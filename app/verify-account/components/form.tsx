"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "react-otp-input";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import "../styles.css";
import Spinner from "@/app/components/loading";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { CheckCircle } from "lucide-react";

const TIMEOUT = 60 * 2;
const LEN_INPUT = 6;

export default function VerifyAccountForm() {
  const [otp, setOtp] = useState("");
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(TIMEOUT);
  const search = useSearchParams();

  const sliceEmail = (email: string | null) => {
    if (!email) return;
    const split = email.split("@");

    if (split[0].length <= 3) return email;
    return "..." + split[0].slice(split[0].length - 3) + "@" + split[1];
  };

  const formatTimeout = (counter: number) => {
    const min = Math.floor(counter / 60);
    const sec = Math.floor(counter % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec} ${min > 0 ? "mins" : "secs"}`;
  };

  const handleOTPChange = (otp: string) => setOtp(otp);

  const handleResendCode = () => {};

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    console.log(otp);
    setLoading(false);
  };

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (timer > 0) {
      timerId = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [timer]);

  return (
    <Card className="space-y-8 shadow-3xl">
      <CardHeader className="text-center space-y-6 mx-auto max-w-sm">
        <CardTitle className="font-bold lg:text-3xl">
          Verify Your Account
        </CardTitle>
        <CardDescription className="sm:text-xl">
          A 6-digit code has been sent to your email address at{" "}
          {sliceEmail(search.get("email"))}
        </CardDescription>
      </CardHeader>
      {alert && (
        <Alert variant="primary">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your password has been reset successfully, you may login with your
            new password.
          </AlertDescription>
        </Alert>
      )}
      <form className="space-y-8" onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-y-4 items-center text-center">
          <p className="sm:text-xl">
            Enter the code within{" "}
            <strong className="text-primary">{formatTimeout(timer)}</strong>
          </p>
          <div className="">
            <OTPInput
              containerStyle="gap-2 sm:gap-4 lg:gap-5"
              numInputs={6}
              inputType="number"
              onChange={handleOTPChange}
              value={otp}
              renderInput={({ style, ...rest }) => (
                <Input
                  {...rest}
                  inputMode="numeric"
                  className="w-9 h-9 sm:w-12 sm:h-12 sm:text-2xl select-none"
                />
              )}
              shouldAutoFocus
            />
          </div>
          <p className="sm:text-xl">
            Didn’t receive a code?
            <Button
              variant="ghost"
              className="sm:text-xl ml-1 text-base"
              onClick={handleResendCode}
            >
              Resend code
            </Button>
          </p>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            disabled={otp.length !== LEN_INPUT || !timer}
            className="w-full font-bold text-xl hover:opacity-100 opacity-90 hover:bg-primary"
          >
            Verify
            {loading && (
              <Spinner
                twColor="text-white before:bg-white"
                twSize="w-4 h-4"
                className="ml-3"
              />
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
