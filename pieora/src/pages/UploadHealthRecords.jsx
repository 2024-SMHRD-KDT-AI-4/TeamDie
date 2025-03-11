import { useState } from "react";
import axios from "axios";

function UploadHealthRecords() {
  const [healthCheckFile, setHealthCheckFile] = useState(null);
  const [medicalRecordFile, setMedicalRecordFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!healthCheckFile || !medicalRecordFile) {
      alert("모든 파일을 업로드하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("healthCheck", healthCheckFile);
    formData.append("medicalRecord", medicalRecordFile);

    try {
      const response = await axios.post("http://127.0.0.1:5002/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("서버 응답:", response); // 🔥 응답 로그 확인

      if (response.status >= 200 && response.status < 300) {
        setMessage("✅ " + response.data.message);
      } else {
        setMessage("❌ 파일 업로드 실패");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(error.response?.data?.error || "❌ 파일 업로드 실패");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">건강검진 PDF 업로드</h2>
      
      <div className="mb-3 text-center">
        <label className="form-label">건강검진 결과 파일 (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setHealthCheckFile)} />
      </div>
      
      <div className="mb-3 text-center">
        <label className="form-label">검진 기록 파일 (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setMedicalRecordFile)} />
      </div>

      <div className="text-center">
        <button className="btn btn-primary" onClick={handleUpload}>OCR 분석 시작</button>
      </div>

      {message && <p className="text-center mt-3">{message}</p>}
    </div>
  );
}

export default UploadHealthRecords;