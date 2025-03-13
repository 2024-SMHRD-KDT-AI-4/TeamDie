import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // motion import 추가
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const products = [
    { id: 1, name: "관절 케어 팩", description: "관절 건강 지키기", image: "/images/blackimg.png" },
    { id: 2, name: "신장&혈당 밸런스 팩", description: "", image: "/images/yelloimg.png" },
    { id: 3, name: "간 & 활력 팩", description: "", image: "/images/pinkimg.png" },
    { id: 4, name: "ONLY 신장 팩", description: "", image: "/images/greenimg.png" },
  ];

  const navigate = useNavigate();
  // 이미지 배열을 useMemo로 메모이제이션하여 불필요한 리렌더링 방지
  const images = useMemo(() => ["images/allpack.png", "/images/main2.png", "/images/img3.png"], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // 이미지 자동 전환
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3초마다 이미지 전환

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 제거
  }, [images.length]); // images.length를 의존성 배열에 추가하여 ESLint 경고 해결

  return (
    <div>
      <div className="container-fluid content-wrapper home-content">
        <h1 className="display-4 text-black text-center">
          <span className="text-danger">지미</span><br></br>씹싸스꺼
        </h1>

        {/* 이미지 자동 전환 (부드러운 페이드 인/아웃 효과 추가) */}
        <motion.div
          key={currentImageIndex} // 각 이미지마다 개별적으로 애니메이션 적용
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2, // 3.5초 동안 전환
            ease: "easeInOut",
          }}
          style={{
            width: "100%",  // 이미지가 화면 전체에 맞게 크기 설정
            height: "600px", // 이미지의 고정된 높이 설정 (필요에 따라 조정)
            overflow: "hidden", // 넘치는 부분은 숨기기
          }}
        >
          <img
            src={images[currentImageIndex]} // currentImageIndex를 사용하여 배열에서 이미지 선택
            alt={`슬라이드 이미지 ${currentImageIndex}`} // alt 텍스트 설정
            className="moving-image"
            style={{
              width: "100%",  // 이미지가 가로에 맞게 늘어나도록 설정
              height: "100%", // 이미지가 세로에 맞게 늘어나도록 설정
              objectFit: "cover", // 비율을 유지하면서 크기에 맞게 잘라내기
            }}
          />
        </motion.div>

        <h1 className="lead text-center fw-bold">건강검진 분석</h1>

        <button
          className="btn btn-primary d-block mx-auto"
          onClick={() => navigate("/upload-health-records")}
        >
          시작하기
        </button>
      </div>

      <div className="mt-5">
        <h2 className="mb-4 text-center fw-bold">제품 목록</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-6 mb-4">
              <div className="card p-4 shadow-sm custom-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top img-fluid custom-image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <div className="d-flex justify-content-center gap-2">
                    <Link to={`/products/${product.id}`} className="btn btn-primary custom-button">
                      상세보기
                    </Link>
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;
