import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "react-otp-input";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";
import Container from "@/components/container";
import { splitCamelCaseText } from "@/lib/utils";
import $api from "@/lib/axios";
import Header from "@/components/header";
import useSession from "@/hooks/session";

const TIMEOUT = 60 * 2;
const LEN_INPUT = 6;
// const initialOTPValues = {
//   char1: "",
//   char2: "",
//   char3: "",
//   char4: "",
//   char5: "",
//   char6: "",
// };

export default function VerifyAccountForm() {
  // const [otp, setOtp] = useState<{ [key: string]: string }>(initialOTPValues);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(TIMEOUT);
  const [isResending, setResending] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const router = useRouter();
  const search = useSearchParams();
  const { toast } = useToast();
  const { session, signIn } = useSession();

  const email = search.get("email");
  const token = search.get("token");

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

  // const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setOtp({ [name]: value });
  // };

  // const canSubmit = () => Object.values(otp).length === 6;

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
      const res = await $api({
        url: `/merchants/account/otp`,
        method: "post",
        data: { email },
      });

      toast({
        duration: 1000 * 5,
        variant: "primary",
        title: "Success",
        description: res.data.message || "Successfully sent OTP to your email",
      });

      setOtp("");
      // setOtp(initialOTPValues);
      setTimer(TIMEOUT);
      const token = res.data.accountCreationToken;
      router.push(`/signup/verify-account?token=${token}&email=${email}`);
    } catch (error: any) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name || "") || undefined,
        description:
          error.data.message || "An error occured while resending otp",
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
    document.cookie = `${name}=${encodePayload}; expires=SAT, 30 OCT 2023 23:59:59 GMT;`;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await $api({
        url: `merchants/account/${token}/complete`,
        method: "post",
        data: { otp },
        // data: { otp: Object.values(otp).join() },
      });

      // Read cookie to get the user login credentials
      const password = readFromCookie();

      if (!password) {
        toast({
          duration: 1000 * 5,
          variant: "destructive",
          title: "Session Error",
          description: "Your previous session has expired, you need to login",
        });
        router.push("/login");
        return;
      }

      await signIn({ email: email!, password });

      // Delete the cookie when signin is successful
      saveToCookie("password", password);
      setOtp("");
      // setOtp(initialOTPValues);
      router.push("/onboarding");
    } catch (error: any) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: splitCamelCaseText(error?.name || "Error"),
        description:
          error.data?.message ||
          error.message ||
          "There was a problem with your request, please try again",
      });
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
    <>
      <Header />
      <Container
        compact
        className="flex items-center justify-center my-16 md:my-24"
      >
        <Card className="space-y-8 shadow-3xl">
          <CardHeader className="text-center space-y-6 mx-auto max-w-sm">
            <CardTitle className="font-bold lg:text-3xl">
              Verify Your Account
            </CardTitle>
            <CardDescription className="sm:text-xl text-inherit">
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
              <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
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
                {/* <Input
                  type="number"
                  autoFocus
                  inputMode="numeric"
                  className="w-9 appearance-none h-9 sm:w-12 sm:h-12 sm:text-2xl"
                  disabled={timer === 0}
                  value={otp.char1}
                  autoComplete="off"
                  maxLength={1}
                  aria-label="Please enter OTP character 1"
                  onChange={(e) => handleOTPChange(e)}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  className="w-9 appearance-none h-9 sm:w-12 sm:h-12 sm:text-2xl"
                  disabled={timer === 0}
                  value={otp.char2}
                  autoComplete="off"
                  maxLength={1}
                  aria-label="Please enter OTP character 2"
                  onChange={(e) => handleOTPChange(e)}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  className="w-9 appearance-none h-9 sm:w-12 sm:h-12 sm:text-2xl"
                  disabled={timer === 0}
                  value={otp.char3}
                  autoComplete="off"
                  maxLength={1}
                  aria-label="Please enter OTP character 3"
                  onChange={(e) => handleOTPChange(e)}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  className="w-9 appearance-none h-9 sm:w-12 sm:h-12 sm:text-2xl"
                  disabled={timer === 0}
                  value={otp.char4}
                  autoComplete="off"
                  maxLength={1}
                  aria-label="Please enter OTP character 4"
                  onChange={(e) => handleOTPChange(e)}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  className="w-9 appearance-none h-9 sm:w-12 sm:h-12 sm:text-2xl"
                  disabled={timer === 0}
                  value={otp.char5}
                  autoComplete="off"
                  maxLength={1}
                  aria-label="Please enter OTP character 5"
                  onChange={(e) => handleOTPChange(e)}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  className="w-9 appearance-none h-9 sm:w-12 sm:h-12 sm:text-2xl"
                  disabled={timer === 0}
                  value={otp.char6}
                  autoComplete="off"
                  maxLength={1}
                  aria-label="Please enter OTP character 6"
                  onChange={(e) => handleOTPChange(e)}
                /> */}
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
      <Toaster />
    </>
  );
}
