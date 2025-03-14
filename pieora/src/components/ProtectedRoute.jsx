import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ProtectedRoute.module.css"; // ✅ CSS 모듈 가져오기

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute 렌더링됨");
    if (!isAuthenticated) {
      setShowModal(true); // 🚀 모달 표시
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    setShowModal(false);
    navigate("/login"); // ✅ 로그인 페이지로 이동
  };

  if (!isAuthenticated) {
    return (
      <>
        {/* 로그인 필요 모달 */}
        {showModal && (
          <div className={styles.overlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3>알림</h3>
              </div>
              <div className={styles.modalBody}>
                <p>로그인 후 사용이 가능합니다.</p>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.button} onClick={handleClose}>
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
