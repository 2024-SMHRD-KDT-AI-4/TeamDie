import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SurveyPage = () => {
  const [questions, setQuestions] = useState([]); // ✅ 설문 데이터를 저장하는 상태
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ 현재 질문 인덱스
  const [email, setEmail] = useState(""); // ✅ JWT에서 가져온 이메일 저장
  const navigate = useNavigate();

  // ✅ JWT에서 이메일 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token"); // 🔹 JWT 토큰 가져오기
    if (!token) {
      console.error("❌ 로그인 토큰이 없습니다.");
      return;
    }

    // 🔹 JWT를 이용해 이메일 가져오기
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }, // 🔹 토큰 포함
        });

        if (response.data && response.data.email) {
          setEmail(response.data.email); // 🔹 이메일 상태 저장
          console.log("✅ JWT에서 가져온 이메일:", response.data.email);
        } else {
          console.error("❌ 사용자 이메일을 가져올 수 없습니다.");
        }
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
      }
    };

    fetchUserData();
  }, []);

  // ✅ MySQL에서 설문 데이터 가져오기
  useEffect(() => {
    if (!email) return; // 🔹 이메일이 없으면 요청하지 않음

    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5012/get_survey?email=${email}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // 🔹 토큰 포함
        });

        console.log("📊 가져온 설문 데이터:", response.data);
        setQuestions([...response.data.common_questions, ...response.data.custom_questions]);
      } catch (error) {
        console.error("❌ 설문 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchSurvey();
  }, [email]); // 🔹 email이 변경될 때마다 실행

  // ✅ 사용자의 응답을 저장하는 함수
  const handleAnswer = async (answer) => {
    if (questions.length === 0) return;

    const question = questions[currentIndex];
    console.log("📋 현재 질문:", question);

    try {
      await axios.post(`http://127.0.0.1:5012/save_answer`, {
        survey_idx: question.survey_idx,
        email: email,  // ✅ 이메일 포함하여 응답 저장
        answer_content: answer, // O=1, X=0
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // 🔹 JWT 포함
      });

      console.log(`✅ 응답 저장: ${answer}`);
    } catch (error) {
      console.error("❌ 답변 저장 오류:", error);
    }

    // 다음 질문으로 이동
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("설문이 완료되었습니다!");
      navigate("/mypage"); // 설문 완료 후 마이페이지 이동
    }
  };

  return (
    <div style={styles.container}>
      <h2>맞춤형 설문</h2>
      {questions.length > 0 ? (
        <>
          <p style={styles.question}>{questions[currentIndex].survey_content}</p>
          <div style={styles.buttonContainer}>
            <button onClick={() => handleAnswer(1)} style={styles.button}>O</button>
            <button onClick={() => handleAnswer(0)} style={styles.button}>X</button>
          </div>
        </>
      ) : (
        <p>설문 데이터를 가져오는 중...</p>
      )}
    </div>
  );
};

// ✅ 스타일 추가
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
};

export default SurveyPage;
