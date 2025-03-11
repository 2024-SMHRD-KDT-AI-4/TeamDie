import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CartPage = () => {
    const [cart, setCart] = useState([
        { id: 1, name: "상품 1", price: 10000, quantity: 1 },
        { id: 2, name: "상품 2", price: 15000, quantity: 1 }
    ]);

    const updateQuantity = (id, quantity) => {
        setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
    };

    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            {/* Header */}
            <nav className="navbar navbar-dark bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="#">피어나</a>
                </div>
            </nav>
            
            {/* Main Content */}
            <div className="container mt-5">
                <h2 className="text-center">장바구니</h2>
                <div className="table-responsive mt-4">
                    <table className="table table-bordered text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>상품</th>
                                <th>가격</th>
                                <th>수량</th>
                                <th>총 가격</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>₩{item.price.toLocaleString()}</td>
                                    <td>
                                        <input 
                                            type="number" 
                                            value={item.quantity} 
                                            className="form-control w-50 mx-auto" 
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} 
                                        />
                                    </td>
                                    <td>₩{(item.price * item.quantity).toLocaleString()}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => removeItem(item.id)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="text-end">
                    <h4>총 합계: <span className="fw-bold">₩{totalPrice.toLocaleString()}</span></h4>
                    <button className="btn btn-primary mt-3">결제하기</button>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3 mt-5">
                <p>&copy; 2025 IAM Clone. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CartPage;
