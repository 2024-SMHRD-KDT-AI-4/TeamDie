import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "./BackButton"; // 뒤로가기 버튼 추가
import "./Header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  console.log("Header 랜더링 - isLoggedIn:", isLoggedIn); // 상태 확인

  return (
    <nav className="navbar custom-navbar">
      <div className="container-fluid d-flex flex-column">
        {/* 상단 영역 (로고 + 아이콘들) */}
        <div className="d-flex justify-content-between align-items-center w-100">
          {/* 로고 */}
          <Link className="navbar-brand fw-bold" to="/">
            <img src="/images/p4.png" alt="" className="logo-img" />
          </Link>

          {/* 네비게이션 아이콘 */}
          <div className="d-flex gap-3 align-items-center">
            {!["/login", "/signup"].includes(location.pathname) && (
              isLoggedIn ? (
                <>
                  {location.pathname !== "/cartpage" && (
                    <button
                      className="nav-link"
                      onClick={() => navigate("/cartpage")}
                      title="장바구니"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      <i className="bi bi-cart fs-4 cart-icon" style={{ fontSize: "30px" }}></i>
                    </button>
                  )}

                  {location.pathname !== "/mypage" && (
                    <button
                      className="nav-link"
                      onClick={() => navigate("/mypage")}
                      title="프로필"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      <i className="bi bi-person-circle fs-4 profile-icon"></i>
                    </button>
                  )}

                  <Link
                    className="nav-link"
                    title="로그아웃"
                    onClick={async () => {
                      console.log("로그아웃 버튼 클릭됨");
                      await logout();
                      console.log("로그아웃 완료됨");
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

        {/* 뒤로가기 버튼 - 홈("/")에서는 보이지 않게 처리 */}
        {location.pathname !== "/" && (
          <div className="mt-2 align-self-start"> {/* 왼쪽 정렬 추가 */}
            <BackButton />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
