import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// .env로 부터 백엔드 URL 받아오기
const BACKEND_API_BASE_URL = process.env
  .NEXT_PUBLIC_BACKEND_API_BASE_URL as string;

export default function JoinPage() {
  const navigate = useNavigate();

  // 회원가입 변수
  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  // null: 검사 전, true: 사용 가능, false: 중복
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 페이지
  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>회원 가입</h1>

      <form>
        <label htmlFor="username">아이디</label>
        <input
          id="username"
          type="text"
          placeholder="아이디 (4자 이상)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={4}
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />

        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호 (4자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={4}
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />

        <label htmlFor="nickname">닉네임</label>
        <input
          id="nickname"
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />

        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />

        {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
      </form>
    </div>
  );
}
