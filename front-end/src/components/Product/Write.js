import React, { useState } from "react";
import "./Write.css";
import { useNavigate } from "react-router-dom";

function Write() {
  const [formData, setFormData] = useState({
    CategoryID: "",
    ProductName: "",
    OriginPrice: 0,
    SellPrice: 0,
    ProductImage: null,
    Description: "",
    Status: "거래중",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, ProductImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("CategoryID", formData.CategoryID);
    data.append("ProductName", formData.ProductName);
    data.append("OriginPrice", formData.OriginPrice);
    data.append("SellPrice", formData.SellPrice);
    data.append("ProductImage", formData.ProductImage);
    data.append("Description", formData.Description);
    data.append("Status", formData.Status);

    fetch("http://localhost:3000/products/register", {
      method: "POST",
      body: data,
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          alert("상품이 성공적으로 등록되었습니다.");
          navigate("/");
        } else {
          alert("상품 등록 중 오류가 발생했습니다.");
        }
      })
      .catch((error) => console.error("상품 등록 오류:", error));
  };

  return (
    <div className="write-container">
      <h2>거래 글쓰기</h2>
      <form onSubmit={handleSubmit}>
        <select name="CategoryID" value={formData.CategoryID} onChange={handleChange} required>
        <option value="" disabled>카테고리를 선택하세요</option>
          <option value="도서">도서</option>
          <option value="의류">의류</option>
          <option value="악세서리">악세서리</option>
          <option value="기타">기타</option>
        </select>
        <input
          type="text"
          name="ProductName"
          placeholder="제품 이름"
          value={formData.ProductName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="OriginPrice"
          placeholder="원래 가격"
          value={formData.OriginPrice}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="SellPrice"
          placeholder="판매 가격"
          value={formData.SellPrice}
          onChange={handleChange}
          required
        />
        <input type="file" name="ProductImage" onChange={handleFileChange} required />
        <textarea
          name="Description"
          placeholder="제품 설명"
          value={formData.Description}
          onChange={handleChange}
          required
        ></textarea>
        <select name="Status" value={formData.Status} onChange={handleChange} required>
        <option value="" disabled>거래상태를 선택하세요</option>
          <option value="거래중">거래중</option>
          <option value="거래완료">거래완료</option>
        </select>
        <button type="submit">등록하기</button>
      </form>
    </div>
  );
}

export default Write;