import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS 임포트
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/js/bootstrap.bundle.min";


// ✅ 서버를 완전히 다시 시작했을 때만 localStorage 초기화
if (!sessionStorage.getItem("sessionStarted")) {
  console.log("앱이 처음 실행됨: localStorage 초기화");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.setItem("sessionStarted", "true"); // 세션 시작 표시
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  
    <BrowserRouter>
      <App />
    </BrowserRouter>
  
);