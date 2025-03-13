import { useState, useEffect } from "react";
import axios from "axios";

function UploadHealthRecords() {
  const [healthCheckFile, setHealthCheckFile] = useState(null);
  const [medicalRecordFile, setMedicalRecordFile] = useState(null);
  const [userEmail, setUserEmail] = useState("");

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
      alert("XML 건강검진 파일과 PDF 검진 기록 파일을 모두 업로드하세요.");
      return;
    }

    if (!userEmail) {
      alert("사용자 이메일 정보를 불러오지 못했습니다.");
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
      alert(response.data.message);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">건강검진 데이터 업로드</h2>

      {/* <p className="text-center">사용자 이메일: {userEmail || "불러오는 중..."}</p> */}

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
    </div>
  );
}

export default UploadHealthRecords;
