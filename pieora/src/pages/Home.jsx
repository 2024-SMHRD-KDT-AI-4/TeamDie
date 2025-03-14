import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Home.css"; // ✅ Home.jsx에서만 적용될 CSS

function Home() {
  const navigate = useNavigate();

  // 상품 데이터 상태 관리
  const [products, setProducts] = useState([]);

  // 백엔드에서 상품 데이터 가져오기
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products`) // Node 서버에서 데이터를 가져옴
      .then((response) => response.json())
      .then((data) => setProducts(data)) // 상태 업데이트
      .catch((error) => console.error("상품 데이터를 불러오는 중 오류 발생:", error));
  }, []);

  //이미지 자동 전환
  const images = useMemo(
    () => ["/images/allpack.png", "/images/main2.png", "/images/img3.png"],
    []
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      <div className="container-fluid content-wrapper home-content">
        <h1 className="display-4 text-black text-center">
          <span className="text-danger">피어나</span><br></br>건강분석
        </h1>

        {/* 이미지 슬라이드 */}
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ width: "100%", height: "600px", overflow: "hidden" }}
        >
          <img
            src={images[currentImageIndex]}
            alt={`슬라이드 이미지 ${currentImageIndex}`}
            className="moving-image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        <h1 className="lead text-center fw-bold">   </h1>
        <button className="btn btn-primary d-block mx-auto" onClick={() => navigate("/upload-health-records")}>
          시작하기
        </button>
      </div>

      <div className="home-page">
        <div className="mt-5">
          <h2 className="mb-4 text-center fw-bold">TOP 4</h2>
          <div className="row">
            {products.map((product) => (
              <div key={product.product_id} className="col-6 mb-4">
                <div className="card p-4 shadow-sm custom-card h-100 d-flex flex-column">
                  <img
                    src={product.product_image_path}
                    alt={product.product_name}
                    className="card-img-top img-fluid custom-image"
                  />
                  <div className="card-body text-center d-flex flex-column justify-content-between">
                    <h5 className="card-title">{product.product_name}</h5>
                    <p className="fw-bold">{product.product_price.toLocaleString()}원</p>
                    <div className="mt-auto">
                      <Link to={`products/${product.product_id}`} className="btn btn-primary custom-button">
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
    </div>
  );
}

export default Home;
