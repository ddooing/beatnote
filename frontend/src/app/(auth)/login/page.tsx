"use client";

// .env.local 파일로부터 백엔드 URL 받아오기
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

export default function LoginPage() {
  const handleNaverLogin = () => {
    window.location.href = `${BACKEND_API_BASE_URL}/oauth2/authorization/naver`;
  };
  return <button onClick={handleNaverLogin}>네이버 로그인</button>;
}
