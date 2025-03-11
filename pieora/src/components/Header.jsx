import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";


function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  console.log("Header 랜더링 - isLoggedIn:", isLoggedIn); // 상태 확인

  return (
    <nav className="navbar custom-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold" to="/">
        <img src="/images/p4.png" alt="" className="logo-img me-2" />
        <span className="fw-bold text-white">피어나</span>
          
        </Link>
        <div className="d-flex gap-3 align-items-center">
          {!["/login", "/signup"].includes(location.pathname) && (
            isLoggedIn ? (
              <>
                <Link className="nav-link" to="/cart" title="장바구니">
                  <i className="bi bi-cart fs-4"></i>
                </Link>
                <Link className="nav-link" to="/profile" title="프로필">
                  <i className="bi bi-person-circle fs-4"></i>
                </Link>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">
                    <span className="login-text fw-bold ">로그인</span>
                </Link>
                <Link className="nav-link" to="/signup">
                  <span className="signup-text fw-bold ">회원가입</span>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;