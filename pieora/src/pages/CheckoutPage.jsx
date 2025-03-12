import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/api/cartpage/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setCart(response.data))
    .catch(error => {
      console.error("Error fetching cart data:", error);
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    });
  }, [token, navigate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ 카카오 우편번호 API 스크립트 로드 완료");
      if (window.daum && window.daum.Postcode) {
        console.log("✅ window.daum.Postcode 정상 로드됨");
      } else {
        console.error("🚨 window.daum.Postcode가 로드되지 않음");
      }
    };
    document.body.appendChild(script);
  }, []);

  const getTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  const handleZipcodeSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("우편번호 API가 아직 로드되지 않았습니다. 페이지를 새로고침 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        setZipcode(data.zonecode);
        setAddress(data.roadAddress);
      },
    }).open();
  };

  const handleCheckout = () => {
    if (!name || !phone || !address || !zipcode) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }

    const orderData = {
      name,
      phone,
      address,
      zipcode,
      paymentMethod,
      totalAmount: getTotalPrice(),
      items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
    };

    axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert("결제가 완료되었습니다!");
      navigate("/order-success");
    })
    .catch(error => {
      console.error("Error processing order:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    });
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">결제 페이지</h2>

      {cart.length === 0 ? (
        <div className="text-center">
          <p>장바구니에 상품이 없습니다.</p>
        </div>
      ) : (
        <div>
          <h4>총액: {getTotalPrice().toLocaleString()} 원</h4>
          <div className="mb-3">
            <label className="form-label">이름</label>
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">연락처</label>
            <input 
              type="text" 
              className="form-control" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">우편번호</label>
            <div className="d-flex">
              <input 
                type="text" 
                className="form-control me-2" 
                value={zipcode} 
                onChange={(e) => setZipcode(e.target.value)}
                readOnly
              />
              <button className="btn btn-secondary" onClick={handleZipcodeSearch}>검색</button>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">배송 주소</label>
            <input 
              type="text" 
              className="form-control" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">결제 방법</label>
            <select 
              className="form-select" 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="credit_card">신용카드</option>
              <option value="bank_transfer">계좌이체</option>
              <option value="paypal">페이팔</option>
            </select>
          </div>
          <button className="btn btn-primary w-100" onClick={handleCheckout}>결제하기</button>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
