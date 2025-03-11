import { Link } from "react-router-dom";

function ProductList() {
  const products = [
    { id: 1, name: "비타민C", description: "건강을 위한 비타민C", image: "/images/img1.jpg" },
    { id: 2, name: "오메가3", description: "뇌 건강을 위한 오메가3", image: "/images/img2.jpg" },
    { id: 3, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" },
    { id: 4, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">제품 목록</h2>
      <div className="row gy-4">  {/* gy-4로 세로 간격 조정 */}
        {products.map((product) => (
          <div key={product.id} className="col-md-6">
            <div className="card p-3 shadow-sm mb-4"> {/* mb-4로 카드 간격 추가 */}
              <img src={product.image} alt={product.name} className="img-fluid rounded mx-auto d-block" />
              <h5 className="card-title mt-2 text-center">{product.name}</h5>
              <p className="card-text text-center">{product.description}</p>
              <Link to={`/products/${product.id}`} className="btn btn-primary d-block mx-auto">
                상세보기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default ProductList;
