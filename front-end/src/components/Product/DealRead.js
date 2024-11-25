// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./DealRead.css";

// function DealRead() {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const [item, setItem] = useState(null);
//   const [isOwner, setIsOwner] = useState(false);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await fetch(`/products/detail/${productId}`);
//         if (!response.ok) {
//           throw new Error("상품 정보를 가져올 수 없습니다.");
//         }
//         const data = await response.json();
//         setItem(data);

//         // 현재 로그인된 사용자가 작성자인지 확인
//         const currentUserId = data.CurrentUserId; // API 응답에 포함
//         const sellerId = data.SellerID;
//         setIsOwner(currentUserId === sellerId); // 작성자인 경우에만 true
//       } catch (error) {
//         console.error("상품 정보 가져오기 실패:", error);
//       }
//     };

//     fetchProductDetails();
//   }, [productId]);

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
//     if (confirmDelete) {
//       try {
//         const response = await fetch(`/products/delete/${productId}`, {
//           method: "DELETE",
//         });
//         if (response.ok) {
//           alert("게시글이 삭제되었습니다.");
//           navigate("/products");
//         } else {
//           alert("삭제 권한이 없습니다.");
//         }
//       } catch (error) {
//         console.error("게시글 삭제 중 오류 발생:", error);
//       }
//     }
//   };

//   const handleEdit = () => {
//     if (!isOwner) {
//       alert("수정 권한이 없습니다.");
//       return;
//     }
//     navigate(`/products/update/${productId}`);
//   };

//   return (
//     <div className="deal-container">
//       {item ? (
//         <>
//           {/* 상단 버튼 */}
//           <div className="top-buttons">
//             <button onClick={handleEdit} className="edit-button">
//               수정하기
//             </button>
//             <button
//               onClick={() => {
//                 if (!isOwner) {
//                   alert("삭제 권한이 없습니다.");
//                   return;
//                 }
//                 handleDelete();
//               }}
//               className="delete-button"
//             >
//               삭제하기
//             </button>
//           </div>

//           {/* 상품 상세 정보 */}
//           <div className="deal-details">
//             <div className="deal-item-details">
//               <img src={item.ProductImageURL} alt={item.ProductName} className="deal-image" />
//               <div className="deal-info">
//                 <h2>{item.ProductName}</h2>
//                 <p>판매자 닉네임: {item.SellerNickname}</p>
//                 <p>판매 가격: {item.SellPrice}원</p>
//                 <p>할인율: {item.Discount}%</p>
//                 <p>거래 상태: {item.Status}</p>
//                 <p>
//                   등록일:{" "}
//                   {new Date(item.RegisterDate).toLocaleString("ko-KR", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//                 <p className="deal-description">제품 설명: {item.Description}</p>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <p>해당 제품의 정보를 불러올 수 없습니다.</p>
//       )}
//     </div>
//   );
// }

// export default DealRead;



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DealRead.css";

function DealRead() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

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
        setIsOwner(currentUserId === sellerId); // 작성자인 경우에만 true
      } catch (error) {
        console.error("상품 정보 가져오기 실패:", error);
      }
    };

    fetchProductDetails();
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
    navigate(`/products/purchase/${productId}`); // 거래하기 창으로 이동
  };

  const handleAddToCart = () => {
    alert("장바구니에 추가되었습니다."); // 장바구니 로직 추가 가능
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
                  등록일: {" "}
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
            <button onClick={handlePurchase} className="purchase-button">
              거래하기
            </button>
            <button onClick={handleAddToCart} className="cart-button">
              장바구니
            </button>
          </div>
        </>
      ) : (
        <p>해당 제품의 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}

export default DealRead;
