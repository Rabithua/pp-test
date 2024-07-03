"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authCall } from "./login/actions";

export default function Home() {
  const router = useRouter();
  async function authCheck() {
    let r = await authCall();
    console.log(r);
    if (r.code !== 0) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }

  useEffect(() => {
    authCheck();
  }, []);
}
