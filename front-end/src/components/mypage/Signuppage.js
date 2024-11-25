// SignUp.js
import React, { useState } from 'react';
import './Signuppage.css';
import axios from 'axios';

function Signuppage() {
  const [formData, setFormData] = useState({
    customerid: '',
    customernickname: '',
    password: '',
    phone: '',
    zip: '',
    address: '',
    addressdetail: '',
    account: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/process/signuppage', formData);
      if (response.data.success) {
        alert('회원가입 성공');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('회원가입 오류', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="customerid" placeholder="고객 ID" value={formData.customerid} onChange={handleChange} required />
        <input type="text" name="customernickname" placeholder="고객 닉네임" value={formData.customernickname} onChange={handleChange} required />
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="전화번호" value={formData.phone} onChange={handleChange} required />
        <input type="text" name="zip" placeholder="우편번호" value={formData.zip} onChange={handleChange} required />
        <input type="text" name="address" placeholder="주소" value={formData.address} onChange={handleChange} required />
        <input type="text" name="addressdetail" placeholder="상세 주소" value={formData.addressdetail} onChange={handleChange} required />
        <input type="text" name="account" placeholder="계좌번호" value={formData.account} onChange={handleChange} required />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Signuppage;
