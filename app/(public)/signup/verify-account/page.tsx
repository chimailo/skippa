"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
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
import { ToastAction } from "@/app/components/ui/toast";
import { useToast } from "@/app/components/ui/use-toast";
import Spinner from "@/app/components/loading";
import Container from "@/app/components/container";
import { splitCamelCaseText } from "@/app/utils";
import Link from "next/link";
import "./styles.css";

const TIMEOUT = 60 * 2;
const LEN_INPUT = 6;

const verifyAccount = async (formData: {
  otp: string;
  token: string | null;
}) => {
  if (!formData.token) throw new Error("Create user token is required");

  const res = await fetch(`/api/merchants/verify-account`, {
    method: "POST",
    body: JSON.stringify(formData),
  });
  const { data } = await res.json();

  return data;
};

const resendCode = async (email: string | null) => {
  if (!email) throw new Error("Your email is required to resend otp");

  const res = await fetch(`/api/merchants/resend-code`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  const { data } = await res.json();
  console.log(data);

  return data;
};

export default function VerifyAccountForm() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(TIMEOUT);
  const [isResending, setResending] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const router = useRouter();
  const search = useSearchParams();
  const { toast } = useToast();
  const email = search.get("email");

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

  const handleResendCode = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setResending(true);

    if (!email) {
      router.push("/login");
      return;
    }

    try {
      const res = await resendCode(email);

      if (!res.success) {
        toast({
          variant: "destructive",
          title: splitCamelCaseText(res.name) || undefined,
          description:
            res.data[0].message || "An error occured while resending otp",
        });
        return;
      }

      setOtp("");
      setTimer(TIMEOUT);
      const token = res.data.accountCreationToken;
      router.push(`/signup/verify-account?token=${token}&email=${email}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured",
      });
    } finally {
      setResending(false);
    }
  };

  const readFromCookie = () => {
    const encodedCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("password="))
      ?.split("=")[1];

    if (encodedCookie) return atob(encodedCookie);
    return null;
  };

  const saveToCookie = (name: string, payload: string) => {
    const encodePayload = btoa(payload);
    document.cookie = `${name}=${encodePayload}; expires=SAT, 30 SEPT 2023 23:59:59 GMT;`;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const res = await verifyAccount({
        otp,
        token: search.get("token"),
      });

      if (!res.success) {
        toast({
          variant: "destructive",
          title: splitCamelCaseText(res.name) || undefined,
          description:
            res.message ||
            "An error occured during otp verification, please try again",
        });
        return;
      }

      // Read cookie to get the user login credentials
      const password = readFromCookie();

      if (!password) {
        toast({
          duration: 1000 * 60 * 69,
          variant: "destructive",
          title: "Session Error",
          description: "Your previous session has expired, you need to login",
          action: (
            <ToastAction asChild altText="Login">
              <Link href="/login">Login</Link>
              Login
            </ToastAction>
          ),
        });
        return;
      }
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (login?.error) {
        const error = JSON.parse(login.error);
        toast({
          variant: "destructive",
          title: splitCamelCaseText(error.name) || undefined,
          description:
            error.message ||
            "There was a problem with your request, please try again",
        });
        return;
      }

      // Delete the cookie when signin is successful
      saveToCookie("password", password);

      setOtp("");
      router.push("/onboarding");
    } catch (error) {
      let desc =
        typeof error === "object" &&
        error &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Ooops..., an error has occured";
      toast({ variant: "destructive", title: "Error", description: desc });
    } finally {
      setSubmitting(false);
    }
  }

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
    <Container
      compact
      className="flex items-center justify-center my-16 md:my-24"
    >
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
                    disabled={timer === 0}
                    className="w-9 h-9 sm:w-12 sm:h-12 sm:text-2xl select-none"
                  />
                )}
                shouldAutoFocus
              />
            </div>
            <p className="sm:text-xl">
              Didn’t receive a code?
              <Button
                type="button"
                variant="ghost"
                className="sm:text-lg ml-1 text-base text-primary hover:text-primary"
                disabled={timer > 0 || isResending}
                onClick={(e) => handleResendCode(e)}
              >
                Resend code
                {isResending && (
                  <Spinner
                    twColor="text-primary before:bg-primary"
                    twSize="w-4 h-4"
                    className="ml-3"
                  />
                )}
              </Button>
            </p>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              disabled={
                otp.length !== LEN_INPUT || !timer || isSubmitting || !email
              }
              className="w-full font-bold text-xl hover:opacity-100 opacity-90 hover:bg-primary"
            >
              Verify
              {isSubmitting && (
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
    </Container>
  );
}
