// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import ProductList from "./pages/ProductList";
// import ProductDetail from "./pages/ProductDetail";
// import { AuthProvider } from "./context/AuthContext"; 
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import UploadHealthRecords from "./pages/UploadHealthRecords";
// import SurveyPage from "./pages/SurveyPage"; 
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ProtectedRoute from "./components/ProtectedRoute";
// import CartPage from "./pages/CartPage";
// import MyPage from "./pages/MyPage";
// import CheckoutPage from "./pages/CheckoutPage";
// import Final from "./pages/Final";
// import Result from "./pages/Result";
// import "./App.css";

// function App() {
//   return (
//     <AuthProvider>
//       <div className="app-container">
//         <Header />
//         <div className="content-wrapper">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/products" element={<ProductList />} />
//             <Route path="/products/:id" element={<ProductDetail />} />

//             <Route element={<ProtectedRoute />}>
//              <Route path="/upload-health-records" element={<UploadHealthRecords />} />
//              <Route path="/cartpage" element={<CartPage />} />
//              <Route path="/mypage" element={<MyPage />} />
//              <Route path="/checkout" element={<CheckoutPage />} />
//             </Route>

//             <Route path="/survey" element={<SurveyPage />} /> 
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/final" element={<Final />} />
//             <Route path="/result" element={<Result />} />
//           </Routes>
//         </div>
//         <Footer />
//       </div>
//     </AuthProvider>
//   );
// }

// export default App;





import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadHealthRecords from "./pages/UploadHealthRecords";
import SurveyPage from "./pages/SurveyPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/CartPage";
import MyPage from "./pages/MyPage";
import CheckoutPage from "./pages/CheckoutPage";
import Final from "./pages/Final";
import Result from "./pages/Result";
import ScrollToTop from "./components/ScrollToTop"; // ✅ 추가
import "./App.css";


function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/upload-health-records" element={<UploadHealthRecords />} />
              <Route path="/cartpage" element={<CartPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/final" element={<Final />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </div>
        
        <ScrollToTop /> 
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
