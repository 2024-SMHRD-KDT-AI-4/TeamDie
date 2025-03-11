import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  console.log("Header 랜더링 - isLoggedIn:", isLoggedIn); // 상태 확인

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold" to="/">
          피어나
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
                    navigate("/");
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">
                  <button className="btn btn-outline-light btn-sm">로그인</button>
                </Link>
                <Link className="nav-link" to="/signup">
                  <button className="btn btn-outline-light btn-sm">회원가입</button>
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