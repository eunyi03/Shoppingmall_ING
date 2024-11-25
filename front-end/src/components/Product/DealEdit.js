import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DealEdit.css";

function DealEdit() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); // 수정 가능한 데이터를 저장
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/products/detail/${productId}`);
        if (!response.ok) {
          throw new Error("상품 정보를 가져올 수 없습니다.");
        }
        const data = await response.json();

        // 폼 데이터 초기화
        setFormData({
          CategoryID: data.CategoryID,
          ProductName: data.ProductName,
          OriginPrice: data.OriginPrice,
          SellPrice: data.SellPrice,
          Discount: data.Discount,
          Description: data.Description,
          Status: data.Status,
        });

        // 현재 로그인된 사용자가 작성자인지 확인
        const currentUserId = data.CurrentUserId; // API 응답에 포함
        const sellerId = data.SellerID;
        setIsOwner(currentUserId === sellerId); // 작성자인 경우에만 true
      } catch (error) {
        console.error("상품 정보 가져오기 실패:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async () => {
    if (!isOwner) {
      alert("수정 권한이 없습니다.");
      return;
    }

    try {
      const response = await fetch(`/products/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("게시글이 수정되었습니다.");
        navigate(`/products/detail/${productId}`);
      } else {
        alert("게시글 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("게시글 수정 중 오류 발생:", error);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/products/delete/${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("게시글이 삭제되었습니다.");
          navigate("/");
        } else {
          alert("게시글 삭제 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
      }
    }
  };

  if (!formData) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="edit-container">
      <h2>게시글 수정 및 삭제</h2>
      <form>
        <select
          name="CategoryID"
          value={formData.CategoryID}
          onChange={handleInputChange}
        >
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
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="OriginPrice"
          placeholder="원래 가격"
          value={formData.OriginPrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="SellPrice"
          placeholder="판매 가격"
          value={formData.SellPrice}
          onChange={handleInputChange}
        />
        <textarea
          name="Description"
          placeholder="제품 설명"
          value={formData.Description}
          onChange={handleInputChange}
        ></textarea>
        <select
          name="Status"
          value={formData.Status}
          onChange={handleInputChange}
        >
          <option value="거래중">거래중</option>
          <option value="거래완료">거래완료</option>
        </select>
      </form>
      <div className="action-buttons">
        <button onClick={handleEdit} className="submit-button">
          수정하기
        </button>
        <button onClick={handleDelete} className="delete-button">
          삭제하기
        </button>
      </div>
    </div>
  );
}

export default DealEdit;