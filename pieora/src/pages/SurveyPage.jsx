
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SurveyPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // ✅ 토큰 확인 및 사용자 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 저장된 토큰:", token || "토큰 없음");

    if (!token) {
      setErrorMessage("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    const fetchUserData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_FLASK_API_URL}/api/user`; // ✅ 백엔드 변경된 API 반영
        console.log("📡 /api/user 요청 URL:", apiUrl);
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📩 /api/user 응답:", response.data);

        if (response.data && response.data.email) {
          setEmail(response.data.email);
          console.log("✅ JWT에서 가져온 이메일:", response.data.email);
        } else {
          throw new Error("사용자 이메일을 가져올 수 없습니다.");
        }
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
        setErrorMessage("사용자 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };

    fetchUserData();
  }, [navigate]);

  // ✅ 설문 데이터 가져오기
  useEffect(() => {
    if (!email) return;

    const fetchSurvey = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const apiUrl = `${process.env.REACT_APP_FLASK_API_URL}/get_survey`; // ✅ 백엔드 API 반영
      console.log("📡 /get_survey 요청 URL:", apiUrl);
      console.log("📡 /get_survey 요청 시 토큰:", token || "토큰 없음");

      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📊 가져온 설문 데이터:", response.data);
        setQuestions([...response.data.common_questions, ...response.data.custom_questions]);
      } catch (error) {
        console.error("❌ 설문 데이터를 불러오는 중 오류 발생:", error);
        if (error.response && error.response.status === 401) {
          setErrorMessage("인증이 실패했습니다. 다시 로그인해주세요.");
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setErrorMessage("설문 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, [email, navigate]);

  // ✅ 사용자의 응답 저장
  const handleAnswer = async (answer) => {
    if (questions.length === 0) return;

    const question = questions[currentIndex];
    const token = localStorage.getItem("token");
    console.log("📡 /save_answer 요청 시 토큰:", token || "토큰 없음");

    try {
      await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/save_answer`, {
        survey_idx: question.survey_idx,
        answer_content: answer,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`✅ 응답 저장: ${answer}`);
    } catch (error) {
      console.error("❌ 답변 저장 오류:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("인증이 실패했습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage("답변 저장에 실패했습니다. 다시 시도해주세요.");
      }
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("설문이 완료되었습니다!");
      navigate("/mypage");
    }
  };

  return (
    <div style={styles.container}>
      <h2>맞춤형 설문</h2>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {isLoading ? (
        <p>설문 데이터를 가져오는 중...</p>
      ) : questions.length > 0 ? (
        <>
          <p style={styles.question}>{questions[currentIndex].survey_content}</p>
          <div style={styles.buttonContainer}>
            <button onClick={() => handleAnswer(1)} style={styles.button}>O</button>
            <button onClick={() => handleAnswer(0)} style={styles.button}>X</button>
          </div>
        </>
      ) : (
        <p>설문 데이터가 없습니다.</p>
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
};

export default SurveyPage;
