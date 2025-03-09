import { Link } from "react-router-dom"; // React Router에서 제공하는 Link 컴포넌트를 가져옵니다. 이를 사용해 페이지 간 내비게이션을 수행합니다.
import { useNavigate } from "react-router-dom"; // React Router에서 제공하는 useNavigate Hook을 가져옵니다. 이를 통해 프로그래밍 방식으로 페이지 이동을 할 수 있습니다.

function Home() { // Home이라는 함수형 컴포넌트를 정의합니다. 이 컴포넌트는 홈 화면을 렌더링합니다.
  const products = [ // products라는 배열을 정의하여 제품 데이터를 저장합니다.
    { id: 1, name: "비타민C", description: "건강을 위한 비타민C", image: "/images/img1.jpg" }, // 첫 번째 제품: ID 1, 이름 "비타민C", 설명, 이미지 경로
    { id: 2, name: "오메가3", description: "뇌 건강을 위한 오메가3", image: "/images/img2.jpg" }, // 두 번째 제품: ID 2, 이름 "오메가3", 설명, 이미지 경로
    { id: 3, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" }, // 세 번째 제품: ID 3, 이름 "프로바이오틱스", 설명, 이미지 경로
    { id: 4, name: "프로바이오틱스", description: "장 건강을 위한 프로바이오틱스", image: "/images/img3.jpg" }, // 네 번째 제품: ID 4, 이름 "프로바이오틱스", 설명, 동일 이미지 경로
  ];

  const navigate = useNavigate(); // useNavigate Hook을 호출하여 navigate라는 함수를 정의합니다. 이 함수는 클릭 이벤트 등으로 페이지 이동을 처리합니다.

  return ( // JSX를 반환하여 UI를 렌더링합니다.
    <div> {/* 최상위 div로 전체 내용을 감쌉니다. */}
      <div className="container-fluid content-wrapper home-content"> {/* Bootstrap의 container 클래스와 커스텀 클래스(content-wrapper, home-content)를 사용하여 레이아웃을 설정합니다. */}
        <h1 className="display-4 text-primary text-center">Welcome to IAM Clone</h1> {/* 큰 제목(h1)으로 "Welcome to IAM Clone"을 표시하며, Bootstrap 스타일(display-4, text-primary)과 중앙 정렬(text-center)을 적용합니다. */}
        <p className="lead text-center">건강검진 분석</p> {/* 부제목(p)으로 "건강검진 분석"을 표시하며, Bootstrap의 lead 스타일과 중앙 정렬을 적용합니다. */}
        <button
          className="btn btn-primary d-block mx-auto" // Bootstrap 버튼 스타일(btn, btn-primary)과 d-block(블록 요소로 변환), mx-auto(가로 중앙 정렬)를 적용합니다.
          onClick={() => navigate("/upload-health-records")} // 버튼 클릭 시 useNavigate를 사용해 "/upload-health-records" 경로로 이동합니다.
        >
          시작하기
        </button>
      </div>

      <div className="mt-5"> {/* Bootstrap의 mt-5(margin-top 5단계) 클래스를 사용하여 위 요소와의 간격을 만듭니다. */}
        <h2 className="mb-4 text-center">제품 목록</h2> {/* 제품 목록 제목(h2)을 표시하며, mb-4(margin-bottom 4단계)와 text-center(중앙 정렬)를 적용합니다. */}
        <div className="row"> {/* Bootstrap의 row 클래스를 사용하여 그리드 시스템을 설정합니다. */}
          {products.map((product) => ( // products 배열을 map 함수로 순회하며 각 제품을 렌더링합니다.
            <div key={product.id} className="col-md-6 col-lg-6 mb-4"> {/* 각 제품을 감싸는 div로, key는 고유 식별자(id)로 설정, col-md-6과 col-lg-6은 중간 및 큰 화면에서 2열 레이아웃, mb-4는 아래 여백을 제공합니다. */}
              <div className="card p-4 shadow-sm custom-card"> {/* Bootstrap의 card 클래스와 p-4(padding 4단계), shadow-sm(약한 그림자 효과), custom-card(커스텀 스타일)를 적용한 카드 컨테이너입니다. */}
                <img src={product.image} alt={product.name} className="card-img-top img-fluid custom-image" /> {/* 제품 이미지를 표시하며, card-img-top(카드 상단 이미지), img-fluid(반응형 이미지), custom-image(커스텀 스타일)를 적용합니다. */}
                <div className="card-body"> {/* 카드 본문 영역을 정의합니다. */}
                  <h5 className="card-title">{product.name}</h5> {/* 제품 이름(h5)을 card-title 스타일로 표시합니다. */}
                  <p className="card-text">{product.description}</p> {/* 제품 설명(p)을 card-text 스타일로 표시합니다. */}
                  <Link to={`/products/${product.id}`} className="btn btn-primary custom-button"> {/* Link 컴포넌트를 사용해 상세 페이지로 이동하며, btn btn-primary(기본 버튼 스타일), custom-button(커스텀 스타일)을 적용합니다. */}
                    상세보기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home; // Home 컴포넌트를 내보내어 다른 파일에서 사용할 수 있도록 합니다.