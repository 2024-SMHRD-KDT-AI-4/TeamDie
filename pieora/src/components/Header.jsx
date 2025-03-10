import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { useState } from "react"; // 상태 관리 (예시)

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 경로가 Login 또는 Signup 페이지인지 확인
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // 로그인 상태 (예시로 useState 사용, 실제로는 Context, Redux 등 사용 가능)
  const [isLoggedIn, setIsLoggedIn] = useState(true); // true로 테스트 중 (로그인 상태)

  // 로그아웃 함수
  const handleLogout = () => {
    // 실제 로그아웃 로직 (예: 토큰 삭제, API 호출 등)
    console.log("로그아웃 실행");

    // 예: 로컬스토리지 토큰 제거
    localStorage.removeItem("accessToken");

    // 로그인 상태 false로 변경
    setIsLoggedIn(false);

    // 로그인 페이지로 이동
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* 로고 */}
        <Link className="navbar-brand fw-bold" to="/">
          피어나
        </Link>

        <div className="d-flex gap-3 align-items-center">
          {/* 로그인 상태와 경로에 따라 조건부 렌더링 */}
          {!isAuthPage && (
            isLoggedIn ? (
              // 로그인된 경우: 장바구니 + 프로필 + 로그아웃
              <>
                <Link className="nav-link" to="/cart" title="장바구니">
                  <i className="bi bi-cart fs-4"></i> {/* 장바구니 아이콘 */}
                </Link>
                <Link className="nav-link" to="/profile" title="프로필">
                  <i className="bi bi-person-circle fs-4"></i> {/* 프로필 아이콘 */}
                </Link>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              // 로그인되지 않은 경우: 로그인 / 회원가입
              <>
                <Link className="nav-link" to="/login">
                  <span className="login-text">로그인</span>
                </Link>
                <Link className="nav-link" to="/signup">
                  <span className="signup-text">회원가입</span>
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
