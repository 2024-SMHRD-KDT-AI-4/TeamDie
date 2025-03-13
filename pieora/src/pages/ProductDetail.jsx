import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("상품을 찾을 수 없습니다.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ 상품 데이터 로드 성공:", data); // ✅ 응답 데이터 확인
        setProduct(data); // 상태 업데이트
      })
      .catch((error) => console.error("❌ 상품 데이터를 불러오는 중 오류 발생:", error));
  }, [id]);
  

  useEffect(() => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    setIsInCart(cart.some((item) => item.id === id));
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

  const handleCartAction = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (isInCart) {
      navigate("/cartPage"); // 이미 장바구니에 있으면 이동
    } else {
      cart.push({
        id,
        name: product.product_name,
        image: product.product_image_path,
        quantity,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsInCart(true);
      alert("장바구니에 추가되었습니다!");
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
        <p className="fs-5">{product.product_description}</p>
      </div>

      {/* 구매 배너 */}
      <div
        className="bg-light p-3 mt-3 rounded shadow-sm text-center"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <div className="d-flex justify-content-center gap-3 mb-2">
          {/* 수량 조절 */}
          <div className="d-flex justify-content-center align-items-center mt-2">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="mx-2 fs-6">{quantity}</span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
          <button onClick={handleCartAction} className="btn btn-secondary btn-sm d-flex align-items-center">
            <FaShoppingCart size={18} className="me-1" />
            {isInCart ? "장바구니 확인" : "장바구니에 추가"}
          </button>
          <button onClick={handlePurchase} className="btn btn-secondary btn-sm">
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
