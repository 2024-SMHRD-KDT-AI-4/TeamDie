// src/components/Final.js
import React from 'react';
import { Container, Button } from 'react-bootstrap'; // 올바른 임포트
import { useNavigate } from 'react-router-dom';

function Final() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // 홈으로 돌아가는 버튼 클릭 시
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="mb-4">결제가 완료됐습니다</h1>
      <p className="mb-4">감사합니다. 결제가 성공적으로 처리되었습니다.</p>
      <Button 
        variant="primary"
        onClick={handleGoHome}
      >
        홈으로 돌아가기
      </Button>
    </Container>
  );
}

export default Final;