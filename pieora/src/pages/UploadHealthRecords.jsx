import { useState } from "react";

function UploadHealthRecords() {
  const [healthCheckImage, setHealthCheckImage] = useState(null);
  const [medicalRecordImage, setMedicalRecordImage] = useState(null);

  const handleFileChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">건강검진 이미지 업로드</h2>
      
      <div className="mb-3 text-center">
        <label className="form-label">건강검진 결과 이미지</label>
        <input type="file" className="form-control" accept="image/*" onChange={(e) => handleFileChange(e, setHealthCheckImage)} />
        {healthCheckImage && <img src={healthCheckImage} alt="건강검진 이미지" className="img-fluid mt-3 rounded" />}
      </div>
      
      <div className="mb-3 text-center">
        <label className="form-label">검진 기록 이미지</label>
        <input type="file" className="form-control" accept="image/*" onChange={(e) => handleFileChange(e, setMedicalRecordImage)} />
        {medicalRecordImage && <img src={medicalRecordImage} alt="검진 기록 이미지" className="img-fluid mt-3 rounded" />}
      </div>
      
      <div className="text-center">
        <button className="btn btn-primary">OCR 분석 시작</button>
      </div>
    </div>
  );
}

export default UploadHealthRecords;
