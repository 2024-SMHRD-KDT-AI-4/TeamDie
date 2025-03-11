import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap"; // gsap import
import { motion } from "framer-motion"; // motion import 추가


function Home() {
  const products = [
    { id: 1, name: "비타민C", description: "건강을 위한 비타민C", image: "/images/img1.jpg" },
    { id: 2, name: "오메가3", description: "뇌 건강을 위한 오메가3", image: "/images/img2.jpg" },
    { id: 3, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" },
    { id: 4, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" },
  ];

  const navigate = useNavigate();
  const logoRef = useRef(null);
  const headingRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "easeInOut" }
    );

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0 },
      { opacity: 1, delay: 1.5, duration: 1 }
    );

    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -100 },
      { opacity: 1, y: 0, duration: 1, ease: "easeOut" }
    );
  }, []);

  return (
    <div>
      <div className="container-fluid content-wrapper home-content">
        <h1 className="display-4 text-black text-center" ref={headingRef}>
          <span className="text-danger">장수</span>잠자리
        </h1>

        <motion.img
          src="/images/메인페이지.png"
          alt="움직이는 이미지"
          className="moving-image"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 2 }}  
          transition={{
            duration: 3.5,
            ease: "easeInOut",
          }}
          ref={logoRef} // 여기에도 ref 추가
        />

        <h1 className="lead text-center fw-bold">건강검진 분석</h1>

        <button
          className="btn btn-primary d-block mx-auto"
          onClick={() => navigate("/upload-health-records")}
          ref={buttonRef}>
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

                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <Link to={`/products/${product.id}`} className="btn btn-primary custom-button">
                    상세보기
                  </Link>
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

