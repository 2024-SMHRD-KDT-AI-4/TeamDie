import React from "react";
import { Link } from "react-router-dom";
import "./Result.css"; // 스타일 파일 추가

const recommendedPack = {
  id: 1,
  name: "에너지 부스트 팩",
  description: "활력을 위한 필수 영양소 포함",
  image: "/images/img1.jpg",
};

function Result() {
  return (
    <div className="result-page container mt-5">
      {/* 건강 분석 소개 섹션 */}
      <div className="text-center mb-5"> {/* 간격 추가 (mb-5) */}
        <h2 className="fw-bold">건강 분석 결과</h2>
        <p className="lead">당신의 건강 상태를 기반으로 맞춤형 영양제를 추천해드립니다.</p>
      </div>

      {/* 추천 영양제 제목 추가 */}
      <div className="text-center mb-4">
        <h3 className="fw-bold">추천 영양제</h3>
      </div>

      {/* 추천 영양제 - 가로 배치 */}
      <div className="d-flex justify-content-center">
        <div className="card shadow-sm result-card">
          <div className="row g-0">
            {/* 이미지 영역 */}
            <div className="col-md-4 d-flex align-items-center">
              <img
                src={recommendedPack.image}
                alt={recommendedPack.name}
                className="img-fluid rounded-start result-img"
              />
            </div>
            {/* 텍스트 영역 */}
            <div className="col-md-8">
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <h5 className="card-title fw-bold">{recommendedPack.name}</h5>
                <p className="card-text">{recommendedPack.description}</p>
                <Link to={`/products/${recommendedPack.id}`} className="btn btn-dark mt-3">
                  상세보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
