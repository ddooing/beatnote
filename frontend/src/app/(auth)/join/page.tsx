"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

// .env.local 파일로부터 백엔드 URL 받아오기
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

export default function JoinPage() {
  const router = useRouter();

  // 회원가입 변수 (상태에 타입 지정)
  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null); // null: 검사 전, true: 사용 가능, false: 중복
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  // username 입력 실시간 중복 확인
  useEffect(() => {
      console.log("BACKEND_API_BASE_URL:",BACKEND_API_BASE_URL);
    // username이 4자 미만이면 검증을 스킵합니다.
    if (username.length < 4) {
      setIsUsernameValid(null);
      return;
    }

    // 디바운싱(Debouncing) 적용: 입력이 멈춘 후 300ms 뒤에 함수 실행
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`${BACKEND_API_BASE_URL}/user/exist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        if (!res.ok) {
          // API 요청 실패 시의 처리를 추가할 수 있습니다.
          throw new Error("API request failed");
        }

        const exists = await res.json();
        setIsUsernameValid(!exists);
      } catch (err) {
        console.error("Username check failed:", err);
        setIsUsernameValid(null); // 에러 발생 시 검증 상태 초기화
      }
    }, 300);

    // 컴포넌트가 언마운트되거나 username이 변경될 때 이전 타이머를 정리합니다.
    return () => clearTimeout(delay);
  }, [username]);

  // 회원 가입 이벤트 핸들러 (이벤트 객체에 타입 지정)
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 모든 필드에 대한 유효성 검사
    if (
      username.length < 4 ||
      password.length < 4 ||
      nickname.trim() === "" ||
      email.trim() === ""
    ) {
      setError(
        "입력값을 다시 확인해주세요. (모든 항목은 필수이며, ID/비밀번호는 최소 4자)"
      );
      return;
    }

    // 아이디 중복 검사를 통과하지 못했다면 회원가입 시도 차단
    if (isUsernameValid !== true) {
      setError("사용 불가능한 아이디입니다.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_API_BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password, nickname, email }),
      });

      if (!res.ok) {
        // 서버로부터 받은 에러 메시지를 표시하는 것이 더 좋습니다.
        const errorData = await res.json();
        throw new Error(errorData.message || "회원가입에 실패했습니다.");
      }

      // 회원가입 성공 시 로그인 페이지로 이동
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  // JSX 렌더링 부분
  return (
    <div>
      <h1>회원 가입</h1>

      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="username">아이디</label>
          <input
            id="username"
            type="text"
            placeholder="아이디 (4자 이상)"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            required
            minLength={4}
          />
          {username.length >= 4 && isUsernameValid === false && (
            <p style={{ color: "red" }}>이미 사용 중인 아이디입니다.</p>
          )}
          {username.length >= 4 && isUsernameValid === true && (
            <p style={{ color: "green" }}>사용 가능한 아이디입니다.</p>
          )}
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호 (4자 이상)"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
            minLength={4}
          />
        </div>

        <div>
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNickname(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={isUsernameValid !== true}>
          회원가입
        </button>
      </form>
    </div>
  );
}