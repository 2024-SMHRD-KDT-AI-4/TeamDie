import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SurveyPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_FLASK_API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.email) {
          setEmail(response.data.email);
        } else {
          throw new Error("사용자 정보를 가져올 수 없습니다.");
        }
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
        setErrorMessage("사용자 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (!email) return;

    const fetchSurvey = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_FLASK_API_URL}/get_survey`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
    
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("❌ 설문 데이터를 불러오는 중 오류 발생:", error);
        setErrorMessage("설문 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, [email]);

  const handleAnswer = async (answer) => {
    if (questions.length === 0) return;
    const question = questions[currentIndex];

    let answerValue = answer;
    if (question.survey_idx === 43) {
      answerValue = parseInt(answer, 10);
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_FLASK_API_URL}/save_answer`,
        {
          survey_idx: question.survey_idx,
          answer_content: answerValue,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(`✅ 응답 저장: ${answerValue}`);
    } catch (error) {
      console.error("❌ 답변 저장 오류:", error);
      setErrorMessage("답변 저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSurveyCompletion();
    }
  };

  const handleSurveyCompletion = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FLASK_API_URL}/recommend_supplements`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log("✅ 추천 알고리즘 실행 완료:", response.data);
      
      // 기존 alert 대신 모달 표시
      setIsModalOpen(true);
    } catch (error) {
      console.error("❌ 추천 알고리즘 실행 오류:", error);
      if (error.response) {
        console.error("🚨 서버 응답 데이터:", error.response.data);
      }
      setErrorMessage("추천 데이터를 생성하는 중 오류가 발생했습니다.");
    }
  };

  // 모달 '확인' 버튼 클릭 시 처리
  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/result");
  };

  return (
    <div style={styles.container}>
      <h2>맞춤형 설문</h2>
      
      {/* 에러 메시지 표시 */}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      {/* 설문 데이터 로딩 상태 */}
      {isLoading ? (
        <p>설문 데이터를 가져오는 중...</p>
      ) : questions.length > 0 ? (
        <>
          <p style={styles.question}>{questions[currentIndex].survey_content}</p>
          <div style={styles.buttonContainer}>
            {questions[currentIndex].survey_idx === 43 ? (
              <select onChange={(e) => handleAnswer(e.target.value)}>
                <option value="0">선택 없음</option>
                <option value="1">항응고제</option>
                <option value="2">혈압약</option>
                <option value="3">당뇨약</option>
                <option value="4">갑상선약</option>
                <option value="5">항생제</option>
                <option value="6">스타틴</option>
                <option value="7">항우울제</option>
                <option value="8">소염진통제</option>
                <option value="9">면역억제제</option>
              </select>
            ) : (
              <>
                <button onClick={() => handleAnswer(1)} style={styles.button}>
                  O
                </button>
                <button onClick={() => handleAnswer(0)} style={styles.button}>
                  X
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <p>설문 데이터가 없습니다.</p>
      )}

      {/* 설문 완료 모달 */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>알림</h3>
            <p>설문이 완료되었습니다!</p>
            <button style={styles.modalButton} onClick={handleCloseModal}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  question: {
    fontSize: "20px",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#ff6b6b",
    color: "#fff",
  },
  error: {
    color: "red",
    marginBottom: "20px",
  },
  // 모달 오버레이 스타일
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  // 모달 컨텐츠 스타일
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px 30px",
    textAlign: "center",
    minWidth: "280px",
  },
  // 모달 제목
  modalTitle: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "18px",
  },
  // 모달 버튼
  modalButton: {
    marginTop: "20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default SurveyPage;
