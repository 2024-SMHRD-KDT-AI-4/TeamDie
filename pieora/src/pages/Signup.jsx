import React from "react";
import "./Signup.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Signup() {
  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <div className="google-signup">
        <button className="google-button">
          <img src="/images/googleimg.png" alt="Google Logo" className="button-icon" />
          구글로 시작하기
        </button>
      </div>
      <div className="kakao-signup">
        <button className="kakao-button">
          <img src="/images/kakaoimg.png" alt="Kakao Logo" className="button-icon" />
          카카오로 시작하기
        </button>
      </div>
    </div>
  );
}

export default Signup;