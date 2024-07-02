"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signUpM } from "./actions";

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  async function submit() {
    console.log("submit", loginData);
    let r = await signUpM(loginData);
    console.log(r);
  }
  
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
          onChange={(e) => {
            setLoginData({
              ...loginData,
              password: e.target.value,
            });
          }}
        />
        <Button onClick={submit}>Login / SignUp</Button>
      </div>
    </div>
  );
}
