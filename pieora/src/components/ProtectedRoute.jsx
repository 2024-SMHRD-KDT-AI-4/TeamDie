import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const alertShown = useRef(false); // ✅ alert가 이미 실행되었는지 체크하는 ref

  useEffect(() => {
    console.log("ProtectedRoute 렌더링됨");
    if (!isAuthenticated && !alertShown.current) {
      alert("로그인 후 사용이 가능합니다.");
      alertShown.current = true; // ✅ alert가 한 번만 실행되도록 설정
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
