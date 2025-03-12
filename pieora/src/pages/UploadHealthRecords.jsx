import { useState } from "react";
import axios from "axios";

function UploadHealthRecords() {
  const [healthCheckFile, setHealthCheckFile] = useState(null);
  const [medicalRecordFile, setMedicalRecordFile] = useState(null);

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

    const formData = new FormData();
    formData.append("health_check", healthCheckFile);
    formData.append("medical_record", medicalRecordFile);

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

      <div className="mb-3 text-center">
        <label className="form-label">건강검진 결과 파일 (XML)</label>
        <input type="file" className="form-control" accept=".xml" onChange={(e) => handleFileChange(e, setHealthCheckFile)} />
      </div>

      <div className="mb-3 text-center">
        <label className="form-label">검진 기록 파일 (PDF)</label>
        <input type="file" className="form-control" accept=".pdf" onChange={(e) => handleFileChange(e, setMedicalRecordFile)} />
      </div>

      <div className="text-center">
        <button className="btn btn-primary" onClick={handleUpload}>OCR 분석 시작</button>
      </div>
    </div>
  );
}

export default UploadHealthRecords;