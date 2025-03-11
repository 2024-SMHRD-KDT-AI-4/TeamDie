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
          <span className="fw-bold text-white"></span>
        </Link>
        <div className="d-flex gap-3 align-items-center">
          {!["/login", "/signup"].includes(location.pathname) && (
            isLoggedIn ? (
              <>
                <Link className="nav-link" to="/cart" title="장바구니">
                  <i className="bi bi-cart fs-4 cart-icon" style={{ fontSize: '30px' }}></i>
                </Link>
                <Link className="nav-link" to="/profile" title="프로필">
                  <i className="bi bi-person-circle fs-4 profile-icon"></i>
                </Link>

                {/* 로그아웃을 Link로 변경 */}
                <Link 
                  className="nav-link" 
                  to="/login" 
                  title="로그아웃"
                  onClick={() => {
                    logout();
                    navigate("/");

                  }}
                >
                  <i 
                    className="bi bi-box-arrow-right fs-4 logout-icon" 
                    style={{
                      color: '#000000',  // 원하는 색상
                      fontSize: '24px'
                    }}
                  ></i> {/* 로그아웃 아이콘 */}
                </Link>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login" title="로그인">
                  <i 
                    className="bi bi-box-arrow-in-right fs-4" 
                    style={{
                      color: '#000000',  // 원하는 색상
                      fontSize: '24px'
                    }}
                  ></i> {/* 로그인 아이콘 */}
                </Link>

                <Link className="nav-link" to="/signup" title="회원가입">
                  <i 
                    className="bi bi-person-plus fs-4" 
                    style={{
                      color: '#000000',  // 원하는 색상
                      fontSize: '24px'
                    }}
                  ></i> {/* 회원가입 아이콘 */}
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








