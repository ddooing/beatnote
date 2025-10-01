"use client";

// .env.local 파일로부터 백엔드 URL 받아오기
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

export default function JoinPage() {
  const handleSocialLogin = (provider) => {
    window.location.href = `${BACKEND_API_BASE_URL}/oauth2/authorization/${provider}`;
  };
  return (
    <div>
      <button onClick={() => handleSocialLogin("naver")}>
        Naver로 계속하기
      </button>
    </div>
  );
}
