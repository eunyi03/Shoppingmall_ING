// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // navigate 사용
// import axios from "axios";
// import "./Mypage.css";

// function Mypage() {
//   const [userInfo, setUserInfo] = useState({});
//   const [userPosts, setUserPosts] = useState([]);
//   const [userTransactions, setUserTransactions] = useState([]);
//   const navigate = useNavigate(); // 페이지 이동용 navigate

//   // 회원 정보 가져오기
//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const response = await axios.get("/mypage/info");
//         if (response.data.success) {
//           setUserInfo(response.data.data);
//         } else {
//           alert("회원 정보를 불러오지 못했습니다.");
//         }
//       } catch (error) {
//         console.error("회원 정보 조회 오류:", error);
//       }
//     };

//     fetchUserInfo();
//   }, []);

//   // 내가 작성한 글 가져오기
//   useEffect(() => {
//     const fetchUserPosts = async () => {
//       try {
//         const response = await axios.get("/mypage/posts");
//         if (response.data.success) {
//           setUserPosts(response.data.data);
//         } else {
//           alert("작성 글 목록을 불러오지 못했습니다.");
//         }
//       } catch (error) {
//         console.error("작성 글 목록 조회 오류:", error);
//       }
//     };

//     fetchUserPosts();
//   }, []);

//   // 내가 거래한 글 가져오기
//   useEffect(() => {
//     const fetchUserTransactions = async () => {
//       try {
//         const response = await axios.get("/mypage/transactions");
//         if (response.data.success) {
//           setUserTransactions(response.data.data);
//         } else {
//           alert("거래한 글 목록을 불러오지 못했습니다.");
//         }
//       } catch (error) {
//         console.error("거래한 글 목록 조회 오류:", error);
//       }
//     };

//     fetchUserTransactions();
//   }, []);

//   // 로그아웃 처리
//   const handleLogout = async () => {
//     try {
//       const response = await axios.post("/process/logout");
//       if (response.data.success) {
//         alert("로그아웃 성공");
//         navigate("/login"); // 로그인 페이지로 이동
//       } else {
//         alert(response.data.message);
//       }
//     } catch (error) {
//       console.error("로그아웃 오류:", error);
//       alert("로그아웃 중 오류가 발생했습니다.");
//     }
//   };

//   return (
//     <div className="mypage-container">
//       <h2>마이페이지</h2>

//       {/* 로그아웃 버튼 */}
//       <div className="mypage-logout">
//         <button onClick={handleLogout} className="logout-button">
//           로그아웃
//         </button>
//       </div>

//       {/* 회원 정보 */}
//       <div className="mypage-section">
//         <h3>회원 정보</h3>
//         <p><strong>아이디:</strong> {userInfo.CustomerID}</p>
//         <p><strong>닉네임:</strong> {userInfo.CustomerNickname}</p>
//         <p><strong>전화번호:</strong> {userInfo.Phone}</p>
//         <p><strong>우편번호:</strong> {userInfo.Zip}</p>
//         <p><strong>주소:</strong> {userInfo.Address}</p>
//         <p><strong>상세 주소:</strong> {userInfo.AddressDetail}</p>
//         <p><strong>계좌번호:</strong> {userInfo.Account}</p>
//       </div>

//       {/* 내가 작성한 글 */}
//       <div className="mypage-section mypage-posts">
//         <h3>내가 작성한 글</h3>
//         {userPosts.length === 0 ? (
//           <p>작성한 글이 없습니다.</p>
//         ) : (
//           <ul>
//             {userPosts.map((post) => (
//               <li key={post.ProductID}>
//                 <p><strong>상품명:</strong> {post.ProductName}</p>
//                 <p><strong>가격:</strong> {post.SellPrice}원</p>
//                 <p><strong>할인율:</strong> {post.Discount}%</p>
//                 <p><strong>상태:</strong> {post.Status}</p>
//                 <p><strong>등록일:</strong> {new Date(post.RegisterDate).toLocaleString("ko-KR")}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* 내가 거래한 글 */}
//       <div className="mypage-section mypage-transactions">
//         <h3>내가 거래한 글</h3>
//         {userTransactions.length === 0 ? (
//           <p>거래한 글이 없습니다.</p>
//         ) : (
//           <ul>
//             {userTransactions.map((transaction) => (
//               <li key={transaction.ProductID}>
//                 <p><strong>상품명:</strong> {transaction.ProductName}</p>
//                 <p><strong>판매자:</strong> {transaction.SellerID}</p>
//                 <p><strong>가격:</strong> {transaction.SellPrice}원</p>
//                 <p><strong>거래 날짜:</strong> {new Date(transaction.OrderDate).toLocaleString("ko-KR")}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Mypage;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // navigate 사용
// import axios from "axios";
// import "./Mypage.css";

// function Mypage() {
//   const [userInfo, setUserInfo] = useState({});
//   const [userPosts, setUserPosts] = useState([]);
//   const [userTransactions, setUserTransactions] = useState([]);
//   const navigate = useNavigate(); // 페이지 이동용 navigate

//   // 회원 정보 가져오기
//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const response = await axios.get("/mypage/info");
//         if (response.data.success) {
//           setUserInfo(response.data.data);
//         } else {
//           alert("회원 정보를 불러오지 못했습니다.");
//         }
//       } catch (error) {
//         console.error("회원 정보 조회 오류:", error);
//       }
//     };

//     fetchUserInfo();
//   }, []);

//   // 내가 작성한 글 가져오기
//   useEffect(() => {
//     const fetchUserPosts = async () => {
//       try {
//         const response = await axios.get("/mypage/posts");
//         if (response.data.success) {
//           setUserPosts(response.data.data);
//         } else {
//           alert("작성 글 목록을 불러오지 못했습니다.");
//         }
//       } catch (error) {
//         console.error("작성 글 목록 조회 오류:", error);
//       }
//     };

//     fetchUserPosts();
//   }, []);

//   // 내가 거래한 글 가져오기
//   useEffect(() => {
//     const fetchUserTransactions = async () => {
//       try {
//         const response = await axios.get("/mypage/transactions");
//         if (response.data.success) {
//           setUserTransactions(response.data.data);
//         } else {
//           alert("거래한 글 목록을 불러오지 못했습니다.");
//         }
//       } catch (error) {
//         console.error("거래한 글 목록 조회 오류:", error);
//       }
//     };

//     fetchUserTransactions();
//   }, []);

//   // 로그아웃 처리
//   const handleLogout = async () => {
//     try {
//       const response = await axios.post("/process/logout");
//       if (response.data.success) {
//         alert("로그아웃 성공");
//         navigate("/login"); // 로그인 페이지로 이동
//       } else {
//         alert(response.data.message);
//       }
//     } catch (error) {
//       console.error("로그아웃 오류:", error);
//       alert("로그아웃 중 오류가 발생했습니다.");
//     }
//   };

//   // DealRead로 이동
//   const navigateToDealRead = (productId) => {
//     navigate(`/products/detail/${productId}`); // DealRead 페이지로 이동
//   };

//   return (
//     <div className="mypage-container">
//       <h2>마이페이지</h2>

//       {/* 로그아웃 버튼 */}
//       <div className="mypage-logout">
//         <button onClick={handleLogout} className="logout-button">
//           로그아웃
//         </button>
//       </div>

//       {/* 회원 정보 */}
//       <div className="mypage-section">
//         <h3>회원 정보</h3>
//         <p><strong>아이디:</strong> {userInfo.CustomerID}</p>
//         <p><strong>닉네임:</strong> {userInfo.CustomerNickname}</p>
//         <p><strong>전화번호:</strong> {userInfo.Phone}</p>
//         <p><strong>우편번호:</strong> {userInfo.Zip}</p>
//         <p><strong>주소:</strong> {userInfo.Address}</p>
//         <p><strong>상세 주소:</strong> {userInfo.AddressDetail}</p>
//         <p><strong>계좌번호:</strong> {userInfo.Account}</p>
//       </div>

//       {/* 내가 작성한 글 */}
//       <div className="mypage-section mypage-posts">
//         <h3>내가 작성한 글</h3>
//         {userPosts.length === 0 ? (
//           <p>작성한 글이 없습니다.</p>
//         ) : (
//           <ul>
//             {userPosts.map((post) => (
//               <li
//                 key={post.ProductID}
//                 className="clickable-item"
//                 onClick={() => navigateToDealRead(post.ProductID)} // 클릭 시 DealRead로 이동
//               >
//                 <p><strong>상품명:</strong> {post.ProductName}</p>
//                 <p><strong>가격:</strong> {post.SellPrice}원</p>
//                 <p><strong>할인율:</strong> {post.Discount}%</p>
//                 <p><strong>상태:</strong> {post.Status}</p>
//                 <p><strong>등록일:</strong> {new Date(post.RegisterDate).toLocaleString("ko-KR")}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* 내가 거래한 글 */}
//       <div className="mypage-section mypage-transactions">
//         <h3>내가 거래한 글</h3>
//         {userTransactions.length === 0 ? (
//           <p>거래한 글이 없습니다.</p>
//         ) : (
//           <ul>
//             {userTransactions.map((transaction) => (
//               <li
//                 key={transaction.ProductID}
//                 className="clickable-item"
//                 onClick={() => navigateToDealRead(transaction.ProductID)} // 클릭 시 DealRead로 이동
//               >
//                 <p><strong>상품명:</strong> {transaction.ProductName}</p>
//                 <p><strong>판매자:</strong> {transaction.SellerID}</p>
//                 <p><strong>가격:</strong> {transaction.SellPrice}원</p>
//                 <p><strong>거래 날짜:</strong> {new Date(transaction.OrderDate).toLocaleString("ko-KR")}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Mypage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Mypage.css";

function Mypage() {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [userCart, setUserCart] = useState([]); // 장바구니 데이터
  const navigate = useNavigate();

  // 회원 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/mypage/info");
        if (response.data.success) {
          setUserInfo(response.data.data);
        } else {
          alert("회원 정보를 불러오지 못했습니다.");
        }
      } catch (error) {
        console.error("회원 정보 조회 오류:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 내가 작성한 글 가져오기
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get("/mypage/posts");
        if (response.data.success) {
          setUserPosts(response.data.data);
        } else {
          alert("작성 글 목록을 불러오지 못했습니다.");
        }
      } catch (error) {
        console.error("작성 글 목록 조회 오류:", error);
      }
    };

    fetchUserPosts();
  }, []);

  // 내가 거래한 글 가져오기
  useEffect(() => {
    const fetchUserTransactions = async () => {
      try {
        const response = await axios.get("/mypage/transactions");
        if (response.data.success) {
          setUserTransactions(response.data.data);
        } else {
          alert("거래한 글 목록을 불러오지 못했습니다.");
        }
      } catch (error) {
        console.error("거래한 글 목록 조회 오류:", error);
      }
    };

    fetchUserTransactions();
  }, []);

  // // 장바구니 가져오기
  // useEffect(() => {
  //   const fetchUserCart = async () => {
  //     try {
  //       const response = await axios.get("/mypage/cart");
  //       if (response.data.success) {
  //         setUserCart(response.data.data);
  //       } else {
  //         alert("장바구니를 불러오지 못했습니다.");
  //       }
  //     } catch (error) {
  //       console.error("장바구니 조회 오류:", error);
  //     }
  //   };

  //   fetchUserCart();
  // }, []);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/mypage/cart");
        const data = await response.json();
        console.log("장바구니 데이터:", data); // 디버깅 로그 추가
  
        if (data.success) {
          setUserCart(data.data); // 장바구니 데이터를 상태로 설정
        } else {
          alert("장바구니를 불러오지 못했습니다.");
        }
      } catch (error) {
        console.error("장바구니 조회 오류:", error);
      }
    };
  
    fetchCart();
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      const response = await axios.post("/process/logout");
      if (response.data.success) {
        alert("로그아웃 성공");
        navigate("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // DealRead로 이동
  const navigateToDealRead = (productId) => {
    navigate(`/products/detail/${productId}`);
  };

  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>

      {/* 로그아웃 버튼 */}
      <div className="mypage-logout">
        <button onClick={handleLogout} className="logout-button">
          로그아웃
        </button>
      </div>

      {/* 회원 정보 */}
      <div className="mypage-section">
        <h3>회원 정보</h3>
        <p><strong>아이디:</strong> {userInfo.CustomerID}</p>
        <p><strong>닉네임:</strong> {userInfo.CustomerNickname}</p>
        <p><strong>전화번호:</strong> {userInfo.Phone}</p>
        <p><strong>우편번호:</strong> {userInfo.Zip}</p>
        <p><strong>주소:</strong> {userInfo.Address}</p>
        <p><strong>상세 주소:</strong> {userInfo.AddressDetail}</p>
        <p><strong>계좌번호:</strong> {userInfo.Account}</p>
      </div>

      {/* 내가 작성한 글 */}
      <div className="mypage-section mypage-posts">
        <h3>내가 작성한 글</h3>
        {userPosts.length === 0 ? (
          <p>작성한 글이 없습니다.</p>
        ) : (
          <ul>
            {userPosts.map((post) => (
              <li
                key={post.ProductID}
                className="clickable-item"
                onClick={() => navigateToDealRead(post.ProductID)}
              >
                <p><strong>상품명:</strong> {post.ProductName}</p>
                <p><strong>가격:</strong> {post.SellPrice}원</p>
                <p><strong>할인율:</strong> {post.Discount}%</p>
                <p><strong>상태:</strong> {post.Status}</p>
                <p><strong>등록일:</strong> {new Date(post.RegisterDate).toLocaleString("ko-KR")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 내가 거래한 글 */}
      <div className="mypage-section mypage-transactions">
        <h3>내가 거래한 글</h3>
        {userTransactions.length === 0 ? (
          <p>거래한 글이 없습니다.</p>
        ) : (
          <ul>
            {userTransactions.map((transaction) => (
              <li
                key={transaction.ProductID}
                className="clickable-item"
                onClick={() => navigateToDealRead(transaction.ProductID)}
              >
                <p><strong>상품명:</strong> {transaction.ProductName}</p>
                <p><strong>판매자:</strong> {transaction.SellerID}</p>
                <p><strong>가격:</strong> {transaction.SellPrice}원</p>
                <p><strong>거래 날짜:</strong> {new Date(transaction.OrderDate).toLocaleString("ko-KR")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 장바구니 */}
      <div className="mypage-section mypage-cart">
        <h3>장바구니</h3>
        {userCart.length === 0 ? (
          <p>장바구니가 비어있습니다.</p>
        ) : (
          <ul>
            {userCart.map((cartItem) => (
              <li
                key={cartItem.ProductID}
                className="clickable-item"
                onClick={() => navigateToDealRead(cartItem.ProductID)}
              >
                <p><strong>상품명:</strong> {cartItem.ProductName}</p>
                <p><strong>판매자:</strong> {cartItem.SellerNickname}</p>
                <p><strong>가격:</strong> {cartItem.SellPrice}원</p>
                <p><strong>할인율:</strong> {cartItem.Discount}%</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Mypage;