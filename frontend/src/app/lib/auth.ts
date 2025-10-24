"use client";

interface AuthRefreshResponse {
    accessToken: string;
    refreshToken: string;
}

// 환경 변수 설정 (실제 프로젝트에 맞게 수정 필요)
// Next.js에서는 일반적으로 NEXT_PUBLIC_ 접두사를 사용합니다.
const API_BASE_URL =process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;


export async function refreshAccessToken(): Promise<string> {
    // 1. 로컬 스토리지로부터 RefreshToken 가져옴
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        throw new Error("RefreshToken이 없습니다. 로그인 필요.");
    }

    const refreshEndpoint = `${API_BASE_URL}/jwt/refresh`;

    // 2. RefreshToken으로 AccessToken 갱신 요청
    const response = await fetch(refreshEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        throw new Error(`AccessToken 갱신 실패: HTTP 오류 ${response.status}`);
    }

    // 3. 성공: 새 토큰 저장 및 반환
    const data: AuthRefreshResponse = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    console.log("AccessToken 갱신 성공");
    return data.accessToken;
}

/**
 * AccessToken을 자동으로 첨부하고, 만료 시 갱신 후 재요청을 시도하는 fetch 래퍼 함수입니다.
 * @param url 요청할 URL
 * @param options fetch 옵션 (RequestInit)
 * @throws {Error} HTTP 오류 또는 토큰 갱신 실패 시
 * @returns {Promise<Response>} API 응답
 */
export async function fetchWithAccess(url: string, options: RequestInit = {}): Promise<Response> {
    // 1. 현재 AccessToken 가져오기
    let accessToken = localStorage.getItem("accessToken");

    // 2. 옵션에 Header가 없으면 추가하고 AccessToken 부착
    if (!options.headers) {
        options.headers = {};
    }
    // Record<string, string> 타입 단언을 통해 headers 객체의 유연성 확보
    (options.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;

    // 3. 첫 번째 요청 진행
    let response = await fetch(url, options);

    // 4. AccessToken 만료(401 Unauthorized) 감지 시, Refresh 시도
    if (response.status === 401) {
        console.warn("401 Unauthorized 감지. AccessToken 갱신 시도...");
        try {
            // 새 AccessToken 갱신
            accessToken = await refreshAccessToken();

            // 갱신된 AccessToken으로 헤더 업데이트
            (options.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;

            // 5. 재요청
            response = await fetch(url, options);
            console.log("AccessToken 갱신 후 재요청 성공.");

        } catch (err) {
            // Refreshing이 실패했기 때문에 (RefreshToken이 없거나 서버 오류)
            // 토큰 삭제 후 로그인 페이지로 리디렉션
            console.error("AccessToken 갱신 실패:", err);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Next.js App Router 환경에서 클라이언트 측 리디렉션
            if (typeof window !== 'undefined') {
                 // location.href를 사용해 페이지 이동 및 전체 상태 초기화
                window.location.href = '/login';
            }

            // 리디렉션 후에도 함수가 계속 실행되는 것을 방지하기 위해 에러를 throw
            throw new Error("인증 실패로 인해 로그인 페이지로 이동합니다.");
        }
    }

    // 6. 최종 응답 확인 및 오류 처리
    if (!response.ok) {
        // 401이 아닌 다른 종류의 HTTP 오류 처리
        throw new Error(`HTTP 오류: ${response.status} - ${response.statusText} (${url})`);
    }

    return response;
}