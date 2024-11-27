import React, { useState, useEffect } from "react";
import "./Deal.css";
import { useNavigate } from "react-router-dom";

function Deal() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/products/list");
        if (!response.ok) throw new Error("상품 목록을 불러오는 데 실패했습니다.");
        const data = await response.json();
        console.log("Fetched Data:", data); // 서버에서 받은 원본 데이터 확인
        setItems(data);
      } catch (error) {
        console.error("상품 목록 조회 오류:", error);
        alert("상품 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    };

    fetchItems();
  }, []);

  const handleAddProduct = () => {
    navigate("/write"); // 글쓰기 페이지로 이동
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // 선택한 카테고리 설정
  };

  const handleItemClick = (productId) => {
    navigate(`/products/detail/${productId}`); // 상세보기 페이지로 이동
  };

  const filteredItems =
    selectedCategory === "전체"
      ? items
      : items.filter((item) => item.CategoryID === selectedCategory);

  return (
    <div className="deal-container">
      <h2>거래 내역</h2>
      <div className="top-controls">
        <select
          className="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="전체">전체</option>
          <option value="도서">도서</option>
          <option value="의류">의류</option>
          <option value="악세서리">악세서리</option>
          <option value="기타">기타</option>
        </select>
        <button className="add-product-button" onClick={handleAddProduct}>
          글쓰기
        </button>
      </div>
      <div className="deal-list">
        {filteredItems.length === 0 ? (
          <p className="no-items">등록된 거래가 없습니다.</p>
        ) : (
          filteredItems.map((item) => {
            // 시간 변환 코드
            const rawDate = item.RegisterDate; // 서버에서 받은 UTC 시간
            const convertedDate = new Date(rawDate); // UTC -> JavaScript Date 객체로 변환
            const formattedDate = convertedDate.toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul", // 명시적으로 KST로 변환
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.ProductID}
                className="deal-item"
                onClick={() => handleItemClick(item.ProductID)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.ProductImageURL}
                  alt={item.ProductName}
                  className="deal-image"
                />
                <div className="deal-info">
                  <h3>{item.ProductName}</h3>
                  <p>판매자: {item.SellerNickname}</p>
                  <p>판매 가격: {item.SellPrice}원</p>
                  <p>할인율: {item.Discount}%</p>
                  <p>거래 상태: {item.Status}</p>
                  <p className="deal-date">등록일: {formattedDate}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Deal;