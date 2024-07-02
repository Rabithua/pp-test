"use client";

import { useRouter } from "next/navigation";
import { authCall } from "../login/actions";
import { useEffect, useState } from "react";
import { db_findUser } from "./actions";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  async function authCheck() {
    let r = await authCall();
    console.log(r);
    if (r.code !== 0) {
      router.push("/login");
    } else {
      getUserInfo(r.data.user.id);
    }
  }

  async function getUserInfo(id: string) {
    let r = await db_findUser(id);
    console.log(r);
    if (r.code === 0) {
      setUser(r.data);
    }
  }

  useEffect(() => {
    authCheck();
  }, []);
  return <div className=" min-h-dvh min-w-dvw">{JSON.stringify(user)}</div>;
}
