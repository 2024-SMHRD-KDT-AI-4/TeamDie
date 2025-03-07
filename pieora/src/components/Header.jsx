import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* 로고 */}
        <Link className="navbar-brand fw-bold" to="/">
          피어나
        </Link>

        {/* 우측 아이콘 메뉴 (AuthPage에서는 숨김) */}
        {!isAuthPage && (
          <div className="d-flex gap-3">
            <Link to="/auth" className="nav-link"> {/* AuthPage로 연결 */}
              <i className="bi bi-person fs-4"></i> {/* 사용자 아이콘 */}
            </Link>
            <Link to="/cart" className="nav-link">
              <i className="bi bi-bag fs-4"></i> {/* 장바구니 아이콘 */}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
