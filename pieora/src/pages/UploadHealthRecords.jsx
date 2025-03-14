import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./UploadHealthRecords.module.css"; // ✅ CSS 모듈 가져오기

function UploadHealthRecords() {
  const [healthCheckFile, setHealthCheckFile] = useState(null);
  const [medicalRecordFile, setMedicalRecordFile] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // ✅ 업로드 성공 여부 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // JWT 가져오기
    if (!token) {
      console.log("토큰이 없습니다.");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/upload-health-records/user`, {
          headers: { Authorization: `Bearer ${token}` }, // JWT 포함
        });

        if (response.data && response.data.email) {
          setUserEmail(response.data.email);
          console.log("사용자 이메일:", response.data.email);
        } else {
          console.error("사용자 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("사용자 데이터 불러오기 실패:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!healthCheckFile || !medicalRecordFile) {
      setModalMessage("XML 건강검진 파일과 PDF 검진 기록 파일을 모두 업로드하세요.");
      setShowModal(true);
      return;
    }

    if (!userEmail) {
      setModalMessage("사용자 이메일 정보를 불러오지 못했습니다.");
      setShowModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("health_check", healthCheckFile);
    formData.append("medical_record", medicalRecordFile);
    formData.append("user_email", userEmail); // 이메일 추가

    try {
      const response = await axios.post("http://localhost:5020/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ 서버 응답이 성공적인 경우
      setModalMessage(response.data.message);
      setUploadSuccess(true); // ✅ 성공 여부 상태 업데이트
      setShowModal(true);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      setModalMessage("파일 업로드에 실패했습니다.");
      setUploadSuccess(false);
      setShowModal(true);
    }
  };

  // ✅ 모달 닫힐 때 업로드 성공 시 /survey 페이지로 이동
  const closeModal = () => {
    setShowModal(false);
    if (uploadSuccess) {
      navigate("/survey");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">건강검진 데이터 업로드</h2>

      <div className="mb-3 text-center">
        <label className="form-label">건강검진 결과 파일 (XML)</label>
        <input type="file" className="form-control" accept=".xml" onChange={(e) => handleFileChange(e, setHealthCheckFile)} />
      </div>

      <div className="mb-3 text-center">
        <label className="form-label">검진 기록 파일 (PDF)</label>
        <input type="file" className="form-control" accept=".pdf" onChange={(e) => handleFileChange(e, setMedicalRecordFile)} />
      </div>

      <div className="text-center">
        <button className="btn btn-primary" onClick={handleUpload}>분석 시작</button>
      </div>

      {/* 모달 표시 */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.title}>알림</h3>
            <p>{modalMessage}</p>
            <button className={styles.button} onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadHealthRecords;
