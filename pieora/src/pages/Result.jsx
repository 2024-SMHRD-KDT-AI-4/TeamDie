// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Result.css";

// const Result = () => {
//   const [product, setProduct] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_FLASK_API_URL}/api/recommendation`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//     })
//       .then((res) => setProduct(res.data))
//       .catch((err) => console.error(err));
//   }, []);


//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem("token"); // JWT 가져오기
//       if (!token) return;

//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/result/user`, {
//           headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 포함
//         });
//         setUser(response.data);
//       } catch (error) {
//         console.error("회원 정보 불러오기 실패:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <div className="result-page">
//       {/* 건강 분석 결과 제목 */}
//       <h1>{user.nickname}님의 건강 분석 결과</h1>
//       <p>빈혈 증상으로 인해 피로감을 자주 느끼실 가능성이 있습니다.
//          신장 건강을 위해 특정 미네랄(칼륨, 마그네슘) 섭취를 주의해야 합니다.
//          현재 복용 중인 소염진통제와 상호작용할 가능성이 있는 영양제(칼륨, 마그네슘, 오메가3)는 제외됩니다.</p>

//       {/* 추천 영양제 제목 */}
//       <div className="text-center mb-4">
//         <h3 className="fw-bold">추천 영양제</h3>
//       </div>

//       {/* 가로 배치된 추천 카드 */}
//       <div className="d-flex justify-content-center">
//         <div className="card shadow-sm result-card">
//           <div className="row g-0 align-items-center">
//             {/* 이미지 영역 */}
//             <div className="col-md-4 d-flex justify-content-center">
//               <img
//                 src={product?.product_image_path}
//                 alt={product?.product_name}
//                 className="img-fluid rounded-start result-img"
//               />
//             </div>
//             {/* 텍스트 영역 */}
//             <div className="col-md-8">
//               <div className="card-body text-center d-flex flex-column justify-content-center">
//                 <h5 className="card-title fw-bold" style={{ marginBottom: "25px" }}>{product?.product_name}</h5>
//                 <h6 className="card-title fw-bold">{product?.product_description}</h6>
//                 <p className="card-text">{product?.description}</p>
//                 <button
//                   className="btn btn-dark mt-3"
//                   onClick={() => navigate(`/products/${product?.product_id}`)}
//                 >
//                   상세보기
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Result;




import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Result.css";
import { FaTired, FaHeartbeat, FaPills } from "react-icons/fa";


const Result = () => {
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate();

  // 추천 영양제 가져오기
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_FLASK_API_URL}/api/recommendation`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 로그인된 회원 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false); // 로딩 상태 해제
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/mypage/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API 응답:", response.data); // 응답 확인
        setUser(response.data || { nickname: "사용자" }); // 기본 닉네임 설정
      } catch (error) {
        console.error("회원 정보 불러오기 실패:", error);
        setUser({ nickname: "사용자" }); // 오류 발생 시 기본값 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchUserData();
  }, []);

  // 데이터 로딩 중이면 "로딩 중..." 표시
  if (loading) {
    return <h1>로딩 중...</h1>;
  }

  return (
    <div className="result-page">
      <div className="text-center mb-4">
        <h3 className="fw-bold">{user?.nickname ? `${user.nickname}님의 건강 분석 결과` : "건강 분석 결과"}</h3>
      </div>
      <p>🥱 <strong>피로 가능성:</strong> 빈혈 증상으로 인해 피로감을 <br /> 자주 느끼실 가능성이 있습니다.</p>
      <p>🏥 <strong>신장 건강 관리:</strong> 특정 미네랄(<span style={{ color: "blue", fontWeight: "bold" }}>칼륨</span>, <span style={{ color: "blue", fontWeight: "bold" }}>마그네슘</span>) 
      <br />섭취를 주의해야 합니다.</p>
      <p>💊 <strong>주의해야 할 영양제:</strong> 현재 복용 중인 소염진통제와 
      <br />상호작용할 가능성이 있는 영양제(<span style={{ color: "green", fontWeight: "bold" }}>칼륨, 마그네슘, 오메가3</span>)는 제외됩니다.</p>
      <br />
      <br />

      <div className="text-center mb-4">
        <h3 className="fw-bold">추천 성분</h3>
      </div>
      <p>🩸 <strong>엽산</strong> – 혈액 건강과 철분 흡수 촉진</p>
      <p>☀️ <strong>비타민D</strong> – 뼈 건강 및 면역력 강화</p>
      <p>🧠 <strong>비타민B12</strong> – 신경 건강 및 빈혈 예방</p>
      <p>⚡ <strong>비타민B군</strong> – 에너지 대사 및 피로 회복</p>
      <p>👀 <strong>루테인</strong> – 50대 이상을 위한 눈 건강 보호</p>
      <hr />

      <br />
      <br />
      <br />

      {/* 추천 영양제 제목 */}
      <div className="text-center mb-4">
        <h3 className="fw-bold">{user?.nickname ? `${user.nickname}님을 위한 피어나 영양제 ` : "피어나 팩"}</h3>
      </div>

      {/* 추천 카드 */}
      {product ? (
        <div className="d-flex justify-content-center">
          <div className="card shadow-sm result-card">
            <div className="row g-0 align-items-center">
              {/* 이미지 영역 */}
              <div className="col-md-4 d-flex justify-content-center">
                <img
                  src={product?.product_image_path}
                  alt={product?.product_name}
                  className="img-fluid rounded-start result-img"
                />
              </div>
              {/* 텍스트 영역 */}
              <div className="col-md-8">
                <div className="card-body text-center d-flex flex-column justify-content-center">
                  <h5 className="card-title fw-bold" style={{ marginBottom: "25px" }}>
                    {product?.product_name}
                  </h5>
                  <h6 className="card-title fw-bold">{product?.product_description}</h6>
                  <p className="card-text">{product?.description}</p>
                  <button
                    className="btn btn-dark mt-3"
                    onClick={() => navigate(`/products/${product?.product_id}`)}
                  >
                    상세보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">추천 영양제를 불러오는 중...</p>
      )}
    </div>
  );
};

export default Result;
