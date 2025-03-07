import { useState, useEffect } from "react";
import { Button, Input, Form } from "antd";
import axios from 'axios';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState(null);
  const [nickname, setNickname] = useState("");
  

  useEffect(() => {
    // 카카오 SDK 로드
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    script.onload = () => {
      if (window.Kakao) {
        window.Kakao.init('755d4080188a318cbacc44b57f7f8026'); // 카카오 API 키 초기화
        console.log("Kakao SDK Initialized:", window.Kakao);
      } else {
        console.error("Kakao SDK initialization failed.");
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleKakaoLogin = () => {
    if (window.Kakao) {
      window.Kakao.Auth.login({
        success: (authObj) => {
          console.log("Kakao Login Success:", authObj); // 로그인 성공 시 로그인 정보 출력
          // 로그인 후 필요한 작업 추가 (예: 서버에 로그인 정보 전송)
        },
        fail: (err) => {
          console.error("Kakao Login Failed:", err); // 로그인 실패 시 에러 출력
        },
        redirectUri: "https://example.com/oauthhh" // 리디렉션 URI 추가
      });
    } else {
      console.error("Kakao SDK is not initialized.");
    }
  };

  

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-0"
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "20px",
        paddingRight: "20px",
        maxWidth: "480px",
        overflowY: "auto"
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 
          style={{
            fontWeight:"bold",
            fontSize:"40px",
            fontFamily: 'S-CoreDream-3Light',
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "30px",
            paddingRight: "20px",
            maxWidth: "480px",
          }}>
          {isLogin ? " 피어나" : " 피어나 "}
        </h1>
        
        <p 
          style={{
            fontSize:"14px",
            fontFamily: 'S-CoreDream-3Light',
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "30px",
            paddingRight: "20px",
            maxWidth: "480px",
            overflowY: "auto"
          }}>
            더 많은 서비스를 위해 로그인 하기
        </p>
        <Form>
          <Form.Item>
            <Button block style={{
              backgroundColor:"rgba(162, 221, 255, 0.99)",
              
              fontFamily: 'S-CoreDream-3Light',
              marginLeft: "30px",
              marginRight: "auto",
              paddingLeft: "20px",
              paddingRight: "20px",
              maxWidth: "250px",
              borderColor: "skyblue",
              boxShadow: "0 0 0 0.5px skyblue",
            }}
            onFocus={(e) => e.target.style.borderColor = 'black'}>
              <p style={{color:"white",textAlign: "center", height: "30%",}}>
              {isLogin ? "로그인" : "회원가입"}
              </p>
            </Button>
          </Form.Item>
        </Form>

        <div className="flex gap-8">
          {/* 네이버 버튼 */}
          <Button style={{ width: '300px', height: '40px', backgroundColor:"rgba(46, 253, 4, 0.99)" 
            ,boxShadow: "0 0 5px white",
          }}>
            <img 
              src="images\O7RUa3BX_400x400.jpg" 
              alt="Naver Logo" 
              style={{ width: '20px', marginRight: '10px', }}
            />
            <p style={{
              height: "20%",
              color:"white",
              fontFamily: 'S-CoreDream-3Light',
              fontSize:"15px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "3px",
              paddingRight: "20px",
              maxWidth: "200px",
              lineHeight:"1.5",
              borderColor: "green",
            }}>
              {isLogin ? "네이버로 로그인하기" :" 네이버로 시작하기"}
            </p>
          </Button>
          
          <br></br>
          <br></br>
          {/* 카카오 버튼 */}
          <Button
            onClick={handleKakaoLogin} 
            style={{ width: '300px', height: '40px', backgroundColor:"rgba(255, 232, 23, 0.99)" }}
          >
            <img 
              src="images\KakaoTalk_20250306_172454670_01.png" 
              alt="Kakao Logo" 
              style={{ width: '20px', marginRight: '10px' }}
            />
            <p style={{
              height: "8%",
              color:"rgb(180,105,30,0.7)",
              fontSize:"15px",
              fontFamily: 'S-CoreDream-3Light',
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "3px",
              paddingRight: "20px",
              maxWidth: "400px",
              
            }}>
              {isLogin ? "카카오로 로그인하기" : " 카카오로 시작하기"}
            </p>
          </Button>
        </div>

        <br />
        <p style={{ fontFamily: 'S-CoreDream-3Light', fontSize: "12px" }}>
          {isLogin ? "계정이 없나요?  " : "이미 계정이 있나요?  "}
          <br />
          <br></br>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 font-bold ml-2 hover:underline"
            style={{ fontFamily: 'S-CoreDream-3Light', width: '100px', height: '20px', margin:'0 auto' }}
          >
            {isLogin ? "회원가입" : "로그인"}
          </Button>
        </p>
      </div>
    </div>
  );
}