"use client";

import { useState,useEffect  } from "react";

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL!;

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

// ✅ 토큰 상태를 React state로 관리
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

          // ✅ 페이지 렌더링 시 현재 토큰 상태 확인
          useEffect(() => {
            const storedAccess = localStorage.getItem("accessToken");
            const storedRefresh = localStorage.getItem("refreshToken");

            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);

            console.log("🔹 [초기 렌더] accessToken:", storedAccess);
            console.log("🔹 [초기 렌더] refreshToken:", storedRefresh);
          }, []);
         // ✅ 로그아웃 전후 토큰 변화 확인용
          useEffect(() => {

            console.log("🌀 accessToken 상태 변화:", accessToken);
          }, [accessToken]);

          useEffect(() => {
            console.log("🌀 refreshToken 상태 변화:", refreshToken);
          }, [refreshToken]);

  const handleNaverLogout = async () => {
    setIsLoggingOut(true);
    setMessage(null);

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      const res = await fetch(`${BACKEND_API_BASE_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      });
    console.log("/logout 시도,refreshToken: ",refreshToken);
      // 토큰 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (res.ok) {
        setMessage("로그아웃이 완료되었습니다.");
      } else {
        setMessage("서버 로그아웃 실패 (프론트는 정리됨)");
      }
    } catch (err) {
      console.error("로그아웃 오류:", err);
      setMessage("로그아웃 중 오류가 발생했습니다.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="p-6 text-center">
      {isLoggingOut ? (
        <p className="text-gray-600">로그아웃 중입니다...</p>
      ) : (
        <button
          onClick={handleNaverLogout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          로그아웃
        </button>
      )}

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
