import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // 로그인 여부 확인

  if (!isAuthenticated) {
    alert("로그인 후 사용이 가능합니다."); // ✅ 로그인하지 않았을 때 경고창 표시
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
