import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Cart() {
  const [cart, setCart] = useState([
    { id: 1, name: "비타민C", description: "건강을 위한 비타민C", image: "/images/img1.jpg", quantity: 1 },
    { id: 2, name: "오메가3", description: "뇌 건강을 위한 오메가3", image: "/images/img2.jpg", quantity: 1 },
  ]);

  const handleRemove = (id) => {
    setCart(cart.filter((product) => product.id !== id));
  };

  const handleQuantityChange = (id, change) => {
    setCart(cart.map(product =>
      product.id === id
        ? { ...product, quantity: product.quantity + change }
        : product
    ));
  };

  const getTotalPrice = () => {
    const priceList = {
      1: 20000, // 비타민C 가격
      2: 25000, // 오메가3 가격
    };
    return cart.reduce((total, product) => total + priceList[product.id] * product.quantity, 0);
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
            <Link to="/checkout" className="btn btn-success">결제하기</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;