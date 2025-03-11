import React, { useEffect } from "react";
import "./Login.css";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext 가져오기

// 카카오 SDK 초기화 함수
const initKakao = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init("afc1d1b96cf546359fe487cb5406089a");
  }
};

// 백엔드에 로그인 데이터 전송 함수
const loginToBackend = async (userInfo, navigate, login) => { // ✅ login 함수 추가
  try {
    const url = `${process.env.REACT_APP_API_URL}/api/login`;
    if (!process.env.REACT_APP_API_URL) {
      throw new Error("REACT_APP_API_URL is not defined in .env");
    }
    const response = await axios.post(url, userInfo, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.message === "로그인 성공") {
      const token = response.data.token;
      login(token); // ✅ AuthContext의 login 호출
      localStorage.setItem("token", token); // 선택적으로 유지 (중복 저장)
      console.log("로그인 후 저장된 토큰:", localStorage.getItem("token")); // ✅ 콘솔 확인
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    }
  } catch (error) {
    console.error("백엔드 로그인 실패:", error.message, error.response?.data);
    alert("로그인 실패: " + (error.response?.data?.error || error.message));
  }
};

function LoginContent() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ useAuth로 login 가져오기

  // 구글 로그인 설정
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      if (!accessToken) {
        console.error("엑세스 토큰이 없습니다.", tokenResponse);
        return;
      }

      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const userInfo = {
          provider: "google",
          provider_id: res.data.sub,
          email: res.data.email || null,
          nickname: res.data.name || null,
          profile_image: res.data.picture || null,
        };
        await loginToBackend(userInfo, navigate, login); // ✅ login 함수 전달
      } catch (error) {
        console.error("구글 사용자 정보 가져오기 실패:", error);
        alert("구글 로그인 처리 중 오류가 발생했습니다.");
      }
    },
    onError: () => {
      console.error("구글 로그인 실패");
      alert("구글 로그인에 실패했습니다.");
    },
    flow: "implicit",
    ux_mode: 'redirect',
  });

  // 카카오 SDK 초기화
  useEffect(() => {
    initKakao();
  }, []);

  // 카카오 로그인 함수
  const kakaoLogin = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      console.error("카카오 SDK가 초기화되지 않았습니다.");
      alert("카카오 SDK 초기화에 실패했습니다.");
      return;
    }

    window.Kakao.Auth.login({
      scope: "profile_nickname, account_email",
      success: async (authObj) => {
        console.log("카카오 로그인 성공:", authObj);

        try {
          const response = await new Promise((resolve, reject) => {
            window.Kakao.API.request({
              url: "/v2/user/me",
              success: resolve,
              fail: reject,
            });
          });

          console.log("카카오 사용자 정보:", response);
          const userInfo = {
            provider: "kakao",
            provider_id: String(response.id),
            email: response.kakao_account?.email || null,
            nickname: response.properties?.nickname || null,
          };
          await loginToBackend(userInfo, navigate, login); // ✅ 백엔드로 로그인 정보 전송
        } catch (error) {
          console.error("카카오 사용자 정보 가져오기 실패:", error);
          alert("카카오 로그인 처리 중 오류가 발생했습니다.");
        }
      },
      fail: (error) => {
        console.error("카카오 로그인 실패:", error);
        alert("카카오 로그인에 실패했습니다.");
      },
    });
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <div className="google-login">
        <button onClick={() => googleLogin()} className="google-button">
          <img src="/images/googleimg.png" alt="Google Logo" className="button-icon" />
          구글로 시작하기
        </button>
      </div>
      <div className="kakao-login">
        <button onClick={kakaoLogin} className="kakao-button">
          <img src="/images/kakaoimg.png" alt="Kakao Logo" className="button-icon" />
          카카오로 시작하기
        </button>
      </div>
    </div>
  );
}

function Login() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}

export default Login;