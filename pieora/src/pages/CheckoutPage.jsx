import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
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

  // 아임포트 스크립트 로드
  useEffect(() => {
    const impScript = document.createElement("script");
    impScript.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    impScript.async = true;
    impScript.onload = () => {
      console.log("✅ 아임포트 스크립트 로드 완료");
      if (typeof window !== "undefined") {
        window.IMP.init(process.env.REACT_APP_IAMPORT_MID);
      }
    };
    document.body.appendChild(impScript);

    return () => {
      document.body.removeChild(impScript);
    };
  }, []);

  // 카카오 우편번호 API 로드
  useEffect(() => {
    const postcodeScript = document.createElement("script");
    postcodeScript.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    postcodeScript.async = true;
    postcodeScript.onload = () => console.log("✅ 카카오 우편번호 API 스크립트 로드 완료");
    document.body.appendChild(postcodeScript);

    return () => {
      document.body.removeChild(postcodeScript);
    };
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

  const handleCertification = () => {
    if (!window.IMP) {
      alert("아임포트가 초기화되지 않았습니다. 페이지를 새로고침해주세요.");
      return;
    }
    window.IMP.certification({
      merchant_uid: `cert_${new Date().getTime()}`,
      pg: "html5_inicis",
      m_redirect_url: "https://your-redirect-url.com",
    }, async (response) => {
      if (response.success) {
        alert("카드 인증이 완료되었습니다!");
      } else {
        alert(`카드 인증 실패: ${response.error_msg}`);
      }
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
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">연락처</label>
            <div className="d-flex">
              <input type="text" className="form-control me-1" placeholder="010" maxLength="3" value={phone1} onChange={(e) => setPhone1(e.target.value)} />
              <input type="text" className="form-control me-1" placeholder="1234" maxLength="4" value={phone2} onChange={(e) => setPhone2(e.target.value)} />
              <input type="text" className="form-control" placeholder="5678" maxLength="4" value={phone3} onChange={(e) => setPhone3(e.target.value)} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">우편번호</label>
            <div className="d-flex">
              <input type="text" className="form-control me-2" value={zipcode} readOnly />
              <button className="btn btn-secondary" onClick={handleZipcodeSearch}>검색</button>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">배송 주소</label>
            <input type="text" className="form-control" value={address} readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">상세 주소</label>
            <input type="text" className="form-control" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} />
          </div>
          <button className="btn btn-primary w-100" onClick={() => navigate("/final")}>결제 하기</button>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;