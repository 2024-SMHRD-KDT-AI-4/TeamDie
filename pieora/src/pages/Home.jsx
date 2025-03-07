import { Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Home() {
  const products = [
    { id: 1, name: "비타민C", description: "건강을 위한 비타민C", image: "/images/img1.jpg" },
    { id: 2, name: "오메가3", description: "뇌 건강을 위한 오메가3", image: "/images/img2.jpg" },
    { id: 3, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" },
    { id: 4, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" },
  ];


  const navigate = useNavigate();  // navigate 변수 정의

  return (
    <div>
      <div className="container content-wrapper home-content">
        <h1 className="display-4 text-primary text-center">Welcome to IAM Clone</h1>
        <p className="lead text-center">건강검진 분석</p>
        <button 
          className="btn btn-primary d-block mx-auto"
          onClick={() => navigate("/upload-health-records")}  // 버튼 클릭 시 페이지 이동
        >
          시작하기
        </button>
      </div>

      <div className="container content-wrapper mt-5">
        <h2 className="mb-4 text-center">제품 목록</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-6">
              <div className="card p-3 shadow-sm">
                <img src={product.image} alt={product.name} className="img-fluid rounded" />
                <h5 className="card-title mt-2">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <Link to={`/products/${product.id}`} className="btn btn-primary">
                  상세보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
