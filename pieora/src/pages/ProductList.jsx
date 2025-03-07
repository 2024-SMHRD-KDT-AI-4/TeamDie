import { Link } from "react-router-dom";

function ProductList() {
  const products = [
    { id: 1, name: "비타민C", description: "건강을 위한 비타민C", image: "/images/img1.jpg" },
    { id: 2, name: "오메가3", description: "뇌 건강을 위한 오메가3", image: "/images/img2.jpg" },
    { id: 3, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" },
    { id: 4, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" },
  ];

  return (
    <div className="container content-wrapper mt-5">  {/* content-wrapper 추가 */}
      <h2 className="mb-4 text-center">제품 목록</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-6">
            <div className="card p-3 shadow-sm">
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
