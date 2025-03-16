import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const MyPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // JWT 가져오기
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/mypage/user`, {
          headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 포함
        });
        setUser(response.data);
      } catch (error) {
        console.error("회원 정보 불러오기 실패:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">마이페이지</h1>
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="card-title">회원 정보</h2>
          <p className="card-text"><strong>이메일 :</strong> {user.email}</p>
          <p className="card-text"><strong>이름 :</strong> {user.nickname}</p>
          <Link to={"/result"} className="btn btn-primary w-100 mt-3">
                  건강 분석 보기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyPage;


