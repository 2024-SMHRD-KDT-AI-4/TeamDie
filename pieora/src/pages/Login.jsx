import React, { useEffect } from "react";
import "./Login.css";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

// 카카오 SDK 초기화 함수
const initKakao = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("afc1d1b96cf546359fe487cb5406089a"); // 카카오 JavaScript 키 입력
        console.log("카카오 SDK 초기화 완료:", window.Kakao.isInitialized());
    }
};

function LoginContent() {
    // 구글 로그인 설정 (기존 코드 유지)
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("onSuccess 실행됨", tokenResponse);

            const accessToken = tokenResponse.access_token;
            if (!accessToken) {
                console.error("엑세스 토큰이 없습니다. 로그인 응답을 확인하세요.", tokenResponse);
                return;
            }

            try {
                // 구글 유저 정보 가져오기 (Google People API)
                const res = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                console.log("구글 사용자 정보:", res.data);
            } catch (error) {
                console.error("구글 사용자 정보 가져오기 실패:", error);
            }
        },
        onError: () => {
            console.error("구글 로그인 실패");
        },
        flow: "implicit", // 또는 'auth-code' (원하는 방식에 따라)
    });

    // 카카오 SDK 초기화 (컴포넌트 마운트 시 실행)
    useEffect(() => {
        initKakao();
    }, []);

    // 카카오 로그인 함수
    const kakaoLogin = () => {
        if (!window.Kakao || !window.Kakao.isInitialized()) {
            console.error("카카오 SDK가 초기화되지 않았습니다.");
            return;
        }

        window.Kakao.Auth.login({
            success: async (authObj) => {
                console.log("카카오 로그인 성공:", authObj);
                try {
                    // 카카오 사용자 정보 요청
                    const response = await new Promise((resolve, reject) => {
                        window.Kakao.API.request({
                            url: "/v2/user/me",
                            success: resolve,
                            fail: reject,
                        });
                    });

                    console.log("카카오 사용자 정보:", response);
                    const userInfo = {
                        id: response.id, // 카카오 사용자 ID
                        email: response.kakao_account?.email,
                        nickname: response.properties?.nickname,
                        profileImage: response.properties?.profile_image,
                    };
                    console.log("정리된 사용자 정보:", userInfo);
                } catch (error) {
                    console.error("카카오 사용자 정보 가져오기 실패:", error);
                }
            },
            fail: (error) => {
                console.error("카카오 로그인 실패:", error);
            },
        });
    };

    return (
        <div className=" login-container fw-bold ">
            <h2>로그인</h2>
            <div className="google-login">
                <button onClick={() => googleLogin()} className="google-button">
                    <img src="/images/googleimg.png" alt="Google Logo" className="button-icon" />
                    구글로 로그인하기
                </button>
            </div>
            <div className="kakao-login">
                <button onClick={kakaoLogin} className="kakao-button">
                    <img src="/images/kakaoimg.png" alt="Kakao Logo" className="button-icon" />
                    카카오로 로그인하기
                </button>
            </div>
        </div>
    );
}

function Login() {
    return (
        <GoogleOAuthProvider clientId="1050378262321-hcq53jgs4o9tge1405om3ic2diqfmu4t.apps.googleusercontent.com">
            <LoginContent />
        </GoogleOAuthProvider>
    );
}

export default Login;