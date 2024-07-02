"use client";

import { useRouter } from "next/navigation";
import { authCall } from "../login/actions";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  async function authCheck() {
    let r = await authCall();
    console.log(r);
    if (r.code !== 0) {
      router.push("/login");
    }
  }

  useEffect(() => {
    authCheck();
  }, []);
  return <div className=" min-h-dvh min-w-dvw">DashboardPage</div>;
}
