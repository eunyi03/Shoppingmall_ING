import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Order.css";

function Order() {
  const { productId } = useParams(); // URL에서 productId 가져오기
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // 상품 정보 상태
  const [orderDetails, setOrderDetails] = useState({
    deliveryAddress: "",
    deliveryDetailAddress: "",
  });
  const shippingFee = 3000; // 고정 배송비

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`/products/purchase/${productId}`);
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          alert("정보를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
        alert("서버 오류가 발생했습니다.");
      }
    };

    fetchProductData();
  }, [productId]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    if (!orderDetails.deliveryAddress || !orderDetails.deliveryDetailAddress) {
      alert("배송지와 상세 주소를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`/products/purchase/${productId}`, {
        sellPrice: product.SellPrice,
        shippingFee: shippingFee,
        deliveryAddress: orderDetails.deliveryAddress,
        deliveryDetailAddress: orderDetails.deliveryDetailAddress,
      });

      if (response.data.success) {
        alert("주문이 성공적으로 완료되었습니다.");
        navigate("/mypage"); // 마이페이지로 이동
      } else {
        alert("주문을 완료할 수 없습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("주문 처리 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="order-container">
      {product ? (
        <form onSubmit={handleOrderSubmit} className="order-form">
          <h2>거래하기</h2>
          {/* 상품 정보 */}
          <div className="form-group">
            <label>상품명</label>
            <input type="text" value={product.ProductName} readOnly />
          </div>
          <div className="form-group">
            <label>판매자 계좌번호</label>
            <input type="text" value={product.SellerAccount} readOnly />
          </div>
          <div className="form-group">
            <label>판매 가격</label>
            <input type="text" value={`${product.SellPrice}원`} readOnly />
          </div>
          <div className="form-group">
            <label>배송비</label>
            <input type="text" value={`${shippingFee}원`} readOnly />
          </div>
          <div className="form-group">
            <label>총 금액</label>
            <input type="text" value={`${product.SellPrice + shippingFee}원`} readOnly />
          </div>

          {/* 주문자 입력 정보 */}
          <div className="form-group">
            <label>배송지</label>
            <input
              type="text"
              placeholder="배송지를 입력하세요"
              value={orderDetails.deliveryAddress}
              onChange={(e) =>
                setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>상세 주소</label>
            <input
              type="text"
              placeholder="상세 주소를 입력하세요"
              value={orderDetails.deliveryDetailAddress}
              onChange={(e) =>
                setOrderDetails({ ...orderDetails, deliveryDetailAddress: e.target.value })
              }
              required
            />
          </div>

          {/* 버튼 */}
          <button type="submit" className="order-button">
            주문하기
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-button"
          >
            취소
          </button>
        </form>
      ) : (
        <p>정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default Order;