import { Link, useLocation } from "react-router-dom";
import "./Header.css";


function Header() {
  const location = useLocation();
  
  // 현재 경로가 Login 또는 Signup 페이지인지 확인
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  
  // 로그인 상태를 확인하는 변수 (예시로 하드코딩, 실제로는 상태 관리 필요)
  const isLoggedIn = false; // 이 부분은 실제 인증 로직으로 대체해야 함 (예: Redux, Context API 등)

  return (
    <nav className="navbar custom-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center">
      
        <Link className="navbar-brand fw-bold" to="/">
        <img src="/images/p4.png" alt="" className="logo-img me-2" />
        <span className="fw-bold text-white">피어나</span>
          
        </Link>

        <div className="d-flex gap-2">
          {/* 로그인 상태와 경로에 따라 조건부 렌더링 */}
          {!isAuthPage && ( // Login, Signup 페이지가 아닐 때만 표시
            isLoggedIn ? (
              // 로그인된 경우: 장바구니 아이콘 표시
              <Link className="nav-link" to="/cart">
                <i className="bi bi-cart fs-4"></i> {/* Bootstrap Icons의 장바구니 아이콘 */}
              </Link>
            ) : (
              // 로그인되지 않은 경우: 로그인과 회원가입 글자 표시
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