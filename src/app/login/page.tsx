"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { authCall, loginCall, signUpCall } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { loginFormSchema } from "@/lib/zod";

export default function LoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  async function submit() {
    console.log("submit", loginData);
    let m = loginFormSchema.safeParse(loginData);
    if (!m.success) {
      toast({
        title: "Uh oh!",
        duration: 2000,
        description: JSON.parse(m.error.message)[0].message,
      });
      return;
    }
    let r = await loginCall(loginData);
    console.log(r);
    if (r?.code === 0) {
      router.push("/dashboard");
    } else {
      if (r?.code === 1) {
        toast({
          title: "Uh oh!",
          duration: 2000,
          description: "User not found,Sing up now?",
          action: (
            <ToastAction altText="SignUp" onClick={signUpFun}>
              SignUp
            </ToastAction>
          ),
        });
      } else if (r?.code === 2) {
        toast({
          title: "Uh oh!",
          duration: 2000,
          description: "Password not match,pleasse try again.",
        });
      }
    }
  }

  async function signUpFun() {
    let r = await signUpCall(loginData);
    console.log(r);
    if (r?.code === 0) {
      toast({
        title: "Success!",
        duration: 2000,
        description: "Sign up success,please login now.",
      });
    } else {
      toast({
        title: "Uh oh!",
        duration: 2000,
        description: "Sign up error,please try again.",
      });
    }
  }

  async function authCheck() {
    let r = await authCall();
    console.log(r);
    if (r.code === 0) {
      router.push("/dashboard");
    }
  }

  useEffect(() => {
    authCheck();
  }, []);

  return (
    <div className=" h-dvh w-dvw flex flex-col justify-center items-center">
      <div className=" flex flex-col gap-4 p-4 rounded-xl border w-5/6 max-w-sm bg-white">
        <div className=" text-xl font-semibold">Note Demo</div>
        <Input
          placeholder="username"
          onChange={(e) => {
            setLoginData({
              ...loginData,
              username: e.target.value,
            });
          }}
        />
        <Input
          placeholder="password"
          type="password"
          onChange={(e) => {
            setLoginData({
              ...loginData,
              password: e.target.value,
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submit();
            }
          }}
        />
        <Button onClick={submit}>Login</Button>
      </div>
    </div>
  );
}
