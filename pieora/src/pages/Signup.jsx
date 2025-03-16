import React, { useEffect, useState } from "react";
import "./Signup.css";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 모달 컴포넌트
const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>알림</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button">확인</button>
        </div>
      </div>
    </div>
  );
};

const initKakao = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(`${process.env.REACT_APP_KAKAO_CLIENT_ID}`);
  }
};

const signupToBackend = async (userInfo, navigate, setModalMessage, setShowModal) => {
  try {
    const url = `${process.env.REACT_APP_API_URL}/api/signup`;
    if (!process.env.REACT_APP_API_URL) {
      throw new Error("REACT_APP_API_URL is not defined in .env");
    }
    const response = await axios.post(url, userInfo, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.message === "회원가입 성공") {
      setModalMessage(response.data.alert);
      setShowModal(true);
    }
  } catch (error) {
    console.error("백엔드 회원가입 실패:", error.message, error.response?.data);
    setModalMessage("회원가입 실패: " + (error.response?.data?.error || error.message));
    setShowModal(true);
  }
};

function SignupContent() {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
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
        await signupToBackend(userInfo, navigate, setModalMessage, setShowModal);
      } catch (error) {
        console.error("구글 사용자 정보 가져오기 실패:", error);
        setModalMessage("구글 로그인 처리 중 오류가 발생했습니다.");
        setShowModal(true);
      }
    },
    onError: () => {
      setModalMessage("구글 로그인에 실패했습니다.");
      setShowModal(true);
    },
  });

  useEffect(() => {
    initKakao();
  }, []);

  const kakaoLogin = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      setModalMessage("카카오 SDK 초기화에 실패했습니다.");
      setShowModal(true);
      return;
    }
    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          const response = await new Promise((resolve, reject) => {
            window.Kakao.API.request({
              url: "/v2/user/me",
              success: resolve,
              fail: reject,
            });
          });
          const userInfo = {
            provider: "kakao",
            provider_id: String(response.id),
            email: response.kakao_account?.email || null,
            nickname: response.properties?.nickname || null,
            profile_image: response.properties?.profile_image || null,
          };
          await signupToBackend(userInfo, navigate, setModalMessage, setShowModal);
        } catch (error) {
          setModalMessage("카카오 로그인 처리 중 오류가 발생했습니다.");
          setShowModal(true);
        }
      },
      fail: () => {
        setModalMessage("카카오 로그인에 실패했습니다.");
        setShowModal(true);
      },
    });
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <div className="google-signup">
        <button onClick={() => googleLogin()} className="google-button">
          <img src="/images/googleimg.png" alt="Google Logo" className="button-icon" />
          구글로 시작하기
        </button>
      </div>
      <div className="kakao-signup">
        <button onClick={kakaoLogin} className="kakao-button">
          <img src="/images/kakaoimg.png" alt="Kakao Logo" className="button-icon" />
          카카오로 시작하기
        </button>
      </div>
      {showModal && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
}

function Signup() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <SignupContent />
    </GoogleOAuthProvider>
  );
}

export default Signup;