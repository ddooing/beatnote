"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

export default function CookiePage() {
const router = useRouter();

  useEffect(() => {
      //3. 쿠키를 백으로 보냄
    const controller = new AbortController();

    const cookieToBody = async () => {
      try {
        const res = await fetch(`${BACKEND_API_BASE_URL}/jwt/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("인증 실패");

        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        router.replace("/"); // 홈으로 이동
      } catch (_err) {
        alert("소셜 로그인 실패");
        router.replace("/login");
      }
    };

    cookieToBody();

    return () => controller.abort();
  }, [router]);

  return <p>로그인 처리 중입니다...</p>;
}