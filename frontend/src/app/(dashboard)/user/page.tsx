"use client";

import { useEffect, useState } from "react";
// 권장: src/lib/fetchWithAccess.ts 로 두고 절대경로 alias(@) 사용
import { fetchWithAccess } from "../../lib/auth";

// Next.js에서는 import.meta.env 대신 process.env.* 사용
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;


type UserInfo = {
  username: string;
  nickname: string;
  email: string;
  // 필요한 필드 더 추가
};


export default function UserPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string>("");

  // 페이지 진입 시 유저 정보 요청
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const res = await fetchWithAccess(`${API_BASE_URL}/user`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("유저 정보 불러오기 실패");

        const data: UserInfo = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error(err);
        setError("유저 정보를 불러오지 못했습니다.");
      }
    };

    loadUserInfo();
  }, []);

  // 로딩 상태 (선택적)
  if (!userInfo && !error)
    return <div className="p-6">⏳ 유저 정보를 불러오는 중...</div>;

  // 오류 표시
  if (error)
    return (
      <div className="p-6 text-red-600">
        ❌ {error}
      </div>
    );

  // 정상 출력
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">내 정보</h1>
      {userInfo ? (
        <ul className="space-y-1">
          <li><b>아이디:</b> {userInfo.username}</li>
          <li><b>닉네임:</b> {userInfo.nickname}</li>
          <li><b>이메일:</b> {userInfo.email}</li>
        </ul>
      ) : (
        <p>유저 정보를 찾을 수 없습니다.</p>
      )}
    </main>
  );
}