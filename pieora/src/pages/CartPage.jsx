import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  
  // ✅ JWT 토큰 가져오기
  const token = localStorage.getItem("token");

  useEffect(() => {
    // ✅ 로그인하지 않은 경우 로그인 페이지로 이동
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/api/cartpage/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,  // ✅ 토큰 추가
      },
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

  const handleRemove = (id) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/cartpage/cart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 토큰 추가
      },
    })
    .then(() => setCart(cart.filter((product) => product.id !== id)))
    .catch(error => console.error("Error removing item:", error));
  };

  const handleQuantityChange = (id, change) => {
    const updatedCart = cart.map(product =>
      product.id === id ? { ...product, quantity: Math.max(1, product.quantity + change) } : product
    );
    setCart(updatedCart);

    const updatedProduct = updatedCart.find(product => product.id === id);
    axios.put(`${process.env.REACT_APP_API_URL}/api/cartpage/cart/${id}`, 
      { quantity: updatedProduct.quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 토큰 추가
        },
      }
    )
    .catch(error => console.error("Error updating quantity:", error));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">장바구니</h2>

      {cart.length === 0 ? (
        <div className="text-center">
          <p>장바구니에 상품이 없습니다.</p>
          <Link to="/" className="btn btn-primary">쇼핑하기</Link>
        </div>
      ) : (
        <div>
          {cart.map((product) => (
            <div key={product.id} className="card mb-3 shadow-sm">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={product.image} alt={product.name} className="img-fluid rounded-start" />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleQuantityChange(product.id, -1)}
                          disabled={product.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2">{product.quantity}</span>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleQuantityChange(product.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <div>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemove(product.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <h4>총액: {getTotalPrice().toLocaleString()} 원</h4>
            <Link to="/checkout" className="btn btn-primary">결제하기</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
