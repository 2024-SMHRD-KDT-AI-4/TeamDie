import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("상품을 찾을 수 없습니다.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("📌 상품 데이터 확인:", data); // ✅ 가격 값 확인
        setProduct(data);
      })
      .catch((error) => console.error("❌ 상품 데이터를 불러오는 중 오류 발생:", error));
  }, [id]);


  if (!product) {
    return (
      <div className="container content-wrapper mt-5">
        <h2>제품을 찾을 수 없습니다.</h2>
      </div>
    );
  }

  const handlePurchase = () => {
    navigate(`/purchase/${id}?quantity=${quantity}`);
  };

  const handleCartAction = async () => {
    const token = localStorage.getItem("token"); // JWT 토큰 가져오기
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      // ✅ 올바른 API 경로: /api/cart → 장바구니 추가 API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cartpage/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: id,
          name: product.product_name,
          description: product.product_description,
          image: product.product_image_path,
          quantity,
          price: product.product_price,
        }),
      });

      if (!response.ok) {
        throw new Error("장바구니 추가 실패");
      }

      const data = await response.json();
      console.log("✅ 장바구니 추가 성공:", data);
      setShowModal(true);
    } catch (error) {
      console.error("❌ 장바구니 추가 오류:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  const handleModalResponse = (moveToCartPage) => {
    setShowModal(false); // 모달 닫기
    if (moveToCartPage) {
      navigate("/cartPage"); // 장바구니 페이지로 이동
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-center mt-3" style={{ fontSize: "1.5rem" }}>
        {product.product_name}
      </h2>

      {/* 이미지 & 설명 */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <img
          src={product.product_image_path}
          alt={product.product_name}
          className="img-fluid rounded"
          style={{ maxWidth: "200px", marginRight: "15px" }}
        />
        <div>
          {/* ✅ 제품 설명 */}
          <p className="fs-5 mb-2">{product.product_description}</p>

          {/* ✅ 가격 정보 (설명 아래) */}
          {product.product_price !== undefined ? (
            <p className="fs-5 fw-bold text-primary">💰 가격: {product.product_price.toLocaleString()}원</p>
          ) : (
            <p className="fs-5 text-danger">⚠ 가격 정보 없음</p>
          )}
        </div>
      </div>


      {/* 구매 배너 */}
      <div
        className="bg-light p-3 mt-3 rounded shadow-sm text-center"
        style={{ maxWidth: "450px", margin: "0 auto" }} // ✅ 레이아웃 여유 확보
      >
        <div className="d-flex align-items-center justify-content-between gap-3">
          {/* 수량 조절 */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
              style={{ width: "35px", height: "35px", fontSize: "1rem", borderRadius: "5px" }} // ✅ 테두리 버튼 & 크기 조정
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="fs-5" style={{ minWidth: "30px", textAlign: "center" }}>{quantity}</span>
            <button
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
              style={{ width: "35px", height: "35px", fontSize: "1rem", borderRadius: "5px" }} // ✅ 테두리 버튼 & 크기 조정
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>

          {/* 장바구니 & 구매하기 버튼 */}
          <div className="d-flex flex-grow-1 gap-2">
            <button
              onClick={handleCartAction}
              className="btn btn-secondary d-flex align-items-center justify-content-center"
              style={{ flex: 1, height: "45px", fontSize: "1rem" }}
            >
              <FaShoppingCart size={18} className="me-1" />
              장바구니
            </button>
            <button
              onClick={handlePurchase}
              className="btn btn-secondary d-flex align-items-center justify-content-center"
              style={{ flex: 1, height: "45px", fontSize: "1rem" }}
            >
              구매하기
            </button>
          </div>
        </div>
      </div>

      {/* 장바구니 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>장바구니 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>이 상품을 장바구니에 추가하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleModalResponse(false)}>
            아니오 (추가만 하기)
          </Button>
          <Button variant="primary" onClick={() => handleModalResponse(true)}>
            예 (추가 후 장바구니 이동)
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductDetail;
