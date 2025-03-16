import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="btn btn-outline-secondary btn-sm fw-bold"
    >
      ← 뒤로가기
    </button>
  );
};

export default BackButton;
