import { useParams, useNavigate } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const productDetails = {
    1: { name: "", description: ".", image: "/images/ssh1img.png" },
    2: { name: "", description: "", image: "/images/ssh2img.png" },
    3: { name: "프로바이오틱스", description: "프로바이오틱스는 장 건강을 지원합니다.", image: "/images/ssh3img.png" },
    4: { name: "프로바이오틱스1", description:"",image:"/images/ssh4img.png"},
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