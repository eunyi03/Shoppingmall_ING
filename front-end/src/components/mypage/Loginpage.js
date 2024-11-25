import React, { useState } from 'react';
import './Loginpage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Loginpage() {
  const [formData, setFormData] = useState({
    customerid: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate(); // navigate 함수 생성

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/process/loginpage', formData);
      if (response.data.success) {
        alert('로그인 성공');
        navigate('/')
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('로그인 오류', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="customerid" placeholder="고객 ID" value={formData.customerid} onChange={handleChange} required />
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Loginpage;