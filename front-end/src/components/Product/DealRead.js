import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DealRead.css";

function DealRead() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null); // 상품 정보 상태
  const [isOwner, setIsOwner] = useState(false); // 작성자인지 확인
  const [reviews, setReviews] = useState([]); // 거래 후기 상태
  const [newReview, setNewReview] = useState(""); // 신규 거래 후기 내용
  const [rating, setRating] = useState(5); // 신규 거래 후기 평점

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/products/detail/${productId}`);
        if (!response.ok) {
          throw new Error("상품 정보를 가져올 수 없습니다.");
        }
        const data = await response.json();
        setItem(data);

        // 현재 로그인된 사용자가 작성자인지 확인
        const currentUserId = data.CurrentUserId; // API 응답에 포함
        const sellerId = data.SellerID;
        setIsOwner(currentUserId === sellerId); // 작성자인 경우 true
      } catch (error) {
        console.error("상품 정보 가져오기 실패:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/reviews/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("거래 후기 가져오기 실패:", error);
      }
    };

    fetchProductDetails();
    fetchReviews();
  }, [productId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/products/delete/${productId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("게시글이 삭제되었습니다.");
          navigate("/products");
        } else {
          alert("삭제 권한이 없습니다.");
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
      }
    }
  };

  const handleEdit = () => {
    if (!isOwner) {
      alert("수정 권한이 없습니다.");
      return;
    }
    navigate(`/products/update/${productId}`);
  };

  const handlePurchase = () => {
    if (isOwner) {
      alert("사용자가 작성한 글입니다.");
      return;
    }

    if (item.Status === "거래완료") {
      alert("이미 거래가 완료된 상품입니다.");
      return;
    }

    navigate(`/products/purchase/${productId}`); // 거래하기 창으로 이동
  };

  const handleAddToCart = () => {
    if (isOwner) {
      alert("사용자가 작성한 글입니다.");
      return;
    }

    if (item.Status === "거래완료") {
      alert("이미 거래가 완료된 상품입니다.");
      return;
    }

    // 장바구니에 추가되었습니다 메시지 후 마이페이지로 이동
    alert("장바구니에 추가되었습니다.");
    navigate("/mypage");
  };

  const handleSubmitReview = async () => {
    if (!newReview.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`/reviews/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comments: newReview,
        }),
      });

      if (response.ok) {
        alert("후기가 성공적으로 등록되었습니다.");
        setNewReview(""); // 입력 필드 초기화
        setRating(5); // 평점 초기화
        const updatedReviews = await response.json();
        setReviews(updatedReviews.reviews); // 업데이트된 리뷰 목록 반영
      } else {
        alert("후기를 등록할 수 없습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("후기 등록 중 오류 발생:", error);
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="deal-container">
      {item ? (
        <>
          {/* 상단 버튼 */}
          <div className="top-buttons">
            <button onClick={handleEdit} className="edit-button">
              수정하기
            </button>
            <button
              onClick={() => {
                if (!isOwner) {
                  alert("삭제 권한이 없습니다.");
                  return;
                }
                handleDelete();
              }}
              className="delete-button"
            >
              삭제하기
            </button>
          </div>

          {/* 상품 상세 정보 */}
          <div className="deal-details">
            <div className="deal-item-details">
              <img src={item.ProductImageURL} alt={item.ProductName} className="deal-image" />
              <div className="deal-info">
                <h2>{item.ProductName}</h2>
                <p>판매자 닉네임: {item.SellerNickname}</p>
                <p>판매 가격: {item.SellPrice}원</p>
                <p>할인율: {item.Discount}%</p>
                <p>거래 상태: {item.Status}</p>
                <p>
                  등록일:{" "}
                  {new Date(item.RegisterDate).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="deal-description">제품 설명: {item.Description}</p>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="bottom-buttons">
            {isOwner ? (
              <button className="disabled-button" disabled>
                사용자가 작성한 글입니다.
              </button>
            ) : item.Status === "거래완료" ? (
              <>
                <button className="disabled-button" disabled>
                  이미 거래가 완료된 상품입니다.
                </button>
                <button className="disabled-button" disabled>
                  장바구니
                </button>
              </>
            ) : (
              <>
                <button onClick={handlePurchase} className="purchase-button">
                  거래하기
                </button>
                <button onClick={handleAddToCart} className="cart-button">
                  장바구니
                </button>
              </>
            )}
          </div>

          {/* 거래 후기 섹션 */}
          <div className="reviews-section">
            <h3>거래 후기</h3>
            {reviews.length === 0 ? (
              <p className="no-reviews-text">아직 거래 후기가 없습니다.</p>
            ) : (
              <ul className="reviews-list">
                {reviews.map((review) => (
                  <li key={review.ReviewID}>
                    <p>
                      <strong>{review.CustomerNickname}</strong>: {review.Comments}
                    </p>
                    <p>평점: {review.Rating} / 5</p>
                  </li>
                ))}
              </ul>
            )}
            {/* 거래 후기 작성 폼 */}
            {item.Status === "거래완료" && !isOwner && (
              <div className="review-input">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="거래 후기를 작성해주세요."
                />
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}점
                    </option>
                  ))}
                </select>
                <button onClick={handleSubmitReview}>후기 작성</button>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>해당 제품의 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}

export default DealRead;