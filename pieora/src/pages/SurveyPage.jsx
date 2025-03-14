import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SurveyPage.module.css"; // ✅ CSS 모듈 적용

const SurveyPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setModalMessage("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      setShowModal(true);
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
        setModalMessage("사용자 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.");
        setShowModal(true);
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

        setQuestions([...response.data.common_questions, ...response.data.custom_questions]);
      } catch (error) {
        console.error("❌ 설문 데이터를 불러오는 중 오류 발생:", error);
        setModalMessage("설문 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
        setShowModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, [email]);

  const handleAnswer = async (answer) => {
    if (questions.length === 0) return;

    const question = questions[currentIndex];

    try {
      await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/save_answer`, {
        survey_idx: question.survey_idx,
        answer_content: answer,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(`✅ 응답 저장: ${answer}`);
    } catch (error) {
      console.error("❌ 답변 저장 오류:", error);
      setModalMessage("답변 저장에 실패했습니다. 다시 시도해주세요.");
      setShowModal(true);
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setModalMessage("설문이 완료되었습니다! 결과페이지로 이동합니다.");
      setShowModal(true);
      setTimeout(() => navigate("/result"));
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className={styles.container}>
      <h2>맞춤형 설문</h2>
      {isLoading ? (
        <p>설문 데이터를 가져오는 중...</p>
      ) : questions.length > 0 ? (
        <>
          <p className={styles.question}>{questions[currentIndex].survey_content}</p>
          <div className={styles.buttonContainer}>
            <button onClick={() => handleAnswer(1)} className={styles.button}>O</button>
            <button onClick={() => handleAnswer(0)} className={styles.button}>X</button>
          </div>
        </>
      ) : (
        <p>설문 데이터가 없습니다.</p>
      )}

      {/* 모달 표시 */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.title}>알림</h3>
            <p>{modalMessage}</p>
            <button className={styles.modalButton} onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyPage;
