import { useParams, useNavigate } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const productDetails = {
    1: { name: "비타민C", description: "비타민C는 면역력 증진에 도움을 줍니다.", image: "/images/img1.jpg" },
    2: { name: "오메가3", description: "오메가3는 혈액순환과 뇌 건강에 좋습니다.", image: "/images/img2.jpg" },
    3: { name: "프로바이오틱스", description: "프로바이오틱스는 장 건강을 지원합니다.", image: "/images/img3.jpg" },
  };

  const product = productDetails[id];

  if (!product) {
    return <div className="container content-wrapper mt-5"><h2>제품을 찾을 수 없습니다.</h2></div>;
  }

  const handlePurchase = () => {
    navigate(`/purchase/${id}`); // 구매 페이지로 이동
  };

  return (
    <div className="container mt-5">  {/* content-wrapper 추가 */}
      <h2 className="text-center">{product.name}</h2>
      <img src={product.image} alt={product.name} className="img-fluid rounded mx-auto d-block" />
      <p className="text-center">{product.description}</p>
      <div className="d-flex flex-column align-items-center">
        <button onClick={handlePurchase} className="btn btn-success d-block mx-auto mt-3">
          구매하기
        </button>
        <a href="/products" className="btn btn-secondary d-block mx-auto mt-3">
          목록으로 돌아가기
        </a>
      </div>
    </div>
  );
}

export default ProductDetail;