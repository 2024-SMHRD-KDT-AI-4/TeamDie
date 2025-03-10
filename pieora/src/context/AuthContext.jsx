import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    console.log("login 호출 후 isLoggedIn:", true); // ✅ 로그 추가
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    console.log("logout 호출 후 isLoggedIn:", false); // ✅ 로그 추가
  };

  console.log("AuthProvider - 현재 isLoggedIn:", isLoggedIn); // ✅ 상태 변화 확인

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}