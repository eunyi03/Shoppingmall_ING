// const express = require("express");
// const mysql = require("mysql");
// const { v4: uuidv4 } = require("uuid"); // UUID 생성
// const db_config = require("../config/db_config.json");

// const router = express.Router();

// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: db_config.host,
//   user: db_config.user,
//   password: db_config.password,
//   database: db_config.database,
//   port: db_config.port,
// });

// // 사용자 로그인 확인 미들웨어
// const checkLogin = (req, res, next) => {
//   const user = req.session?.user;
//   if (!user || !user.CustomerID) {
//     return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
//   }
//   next();
// };

// // 상품 정보 및 사용자 정보 조회
// router.get("/products/purchase/:productId", checkLogin, (req, res) => {
//   const userId = req.session.user.CustomerID; // 세션에서 사용자 ID 가져오기
//   const productId = req.params.productId;

//   console.log("거래 요청 사용자 ID:", userId);
//   console.log("요청된 ProductID:", productId);

//   // 상품 정보 조회
//   pool.query(
//     `SELECT p.ProductID, p.ProductName, p.SellPrice, p.SellerID, c.CustomerNickname AS SellerNickname
//      FROM Products p
//      JOIN Customers c ON p.SellerID = c.CustomerID
//      WHERE p.ProductID = ?`,
//     [productId],
//     (error, productResults) => {
//       if (error) {
//         console.error("상품 정보 조회 오류:", error);
//         return res.status(500).json({ success: false, message: "상품 정보 조회 오류" });
//       }
//       if (productResults.length === 0) {
//         console.error("상품 정보를 찾을 수 없습니다:", productId);
//         return res.status(404).json({ success: false, message: "상품을 찾을 수 없습니다." });
//       }

//       // 사용자 정보 조회
//       pool.query(
//         "SELECT CustomerID, CustomerNickname FROM Customers WHERE CustomerID = ?",
//         [userId],
//         (userError, userResults) => {
//           if (userError) {
//             console.error("사용자 정보 조회 오류:", userError);
//             return res.status(500).json({ success: false, message: "사용자 정보 조회 오류" });
//           }
//           if (userResults.length === 0) {
//             console.error("사용자 정보를 찾을 수 없습니다:", userId);
//             return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
//           }

//           // 성공적으로 데이터 반환
//           res.status(200).json({
//             success: true,
//             data: {
//               userData: userResults[0],
//               productData: productResults[0],
//             },
//           });
//         }
//       );
//     }
//   );
// });

// // 주문 생성
// router.post("/products/purchase/:productId", checkLogin, (req, res) => {
//   const { productId } = req.params;
//   const { sellPrice, shippingFee } = req.body;
//   const userId = req.session.user.CustomerID; // 세션에서 사용자 ID 가져오기
//   const orderId = uuidv4().slice(0, 20); // 주문 ID 생성 (20자 제한)

//   console.log("거래 요청:", { userId, productId, sellPrice, shippingFee });

//   // 총 금액 계산
//   const totalPrice = sellPrice + (shippingFee || 3000);

//   // 트랜잭션 시작
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("데이터베이스 연결 오류:", err);
//       return res.status(500).json({ success: false, message: "데이터베이스 연결 오류" });
//     }

//     connection.beginTransaction((transactionError) => {
//       if (transactionError) {
//         console.error("트랜잭션 시작 오류:", transactionError);
//         connection.release();
//         return res.status(500).json({ success: false, message: "트랜잭션 시작 오류" });
//       }

//       // Orders 테이블에 데이터 삽입
//       connection.query(
//         `INSERT INTO Orders (OrderID, CustomerID, TotalPrice, ShippingFee, OrderDate)
//          VALUES (?, ?, ?, ?, NOW())`,
//         [orderId, userId, totalPrice, shippingFee || 3000],
//         (orderError) => {
//           if (orderError) {
//             console.error("Orders 테이블 삽입 오류:", orderError);
//             return connection.rollback(() => {
//               connection.release();
//               res.status(500).json({ success: false, message: "주문 생성 오류" });
//             });
//           }

//           // OrderDetails 테이블에 데이터 삽입
//           connection.query(
//             `INSERT INTO OrderDetails (OrderID, ProductID, SellerID, CustomerID, SellPrice)
//              VALUES (?, ?, (SELECT SellerID FROM Products WHERE ProductID = ?), ?, ?)`,
//             [orderId, productId, productId, userId, sellPrice],
//             (detailsError) => {
//               if (detailsError) {
//                 console.error("OrderDetails 테이블 삽입 오류:", detailsError);
//                 return connection.rollback(() => {
//                   connection.release();
//                   res.status(500).json({ success: false, message: "주문 세부정보 생성 오류" });
//                 });
//               }

//               // 트랜잭션 커밋
//               connection.commit((commitError) => {
//                 if (commitError) {
//                   console.error("트랜잭션 커밋 오류:", commitError);
//                   return connection.rollback(() => {
//                     connection.release();
//                     res.status(500).json({ success: false, message: "트랜잭션 커밋 오류" });
//                   });
//                 }

//                 // 성공 응답
//                 connection.release();
//                 res.status(201).json({
//                   success: true,
//                   message: "거래가 성공적으로 완료되었습니다.",
//                   orderId: orderId,
//                 });
//               });
//             }
//           );
//         }
//       );
//     });
//   });
// });

// module.exports = router;

const express = require("express");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const db_config = require("../config/db_config.json");

const router = express.Router();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
});

// 로그인 체크 미들웨어
const checkLogin = (req, res, next) => {
  const user = req.session?.user;
  if (!user || !user.CustomerID) {
    return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
  }
  next();
};

// 거래 폼 데이터 반환
router.get("/products/purchase/:productId", checkLogin, (req, res) => {
  const userId = req.session.user.CustomerID; // 세션에서 사용자 ID 가져오기
  const productId = req.params.productId;

  pool.query(
    `SELECT 
      p.ProductID, 
      p.ProductName, 
      p.SellPrice, 
      p.Status, 
      p.SellerID,
      c.CustomerNickname AS SellerNickname, 
      c.Account AS SellerAccount,
      u.CustomerNickname AS BuyerNickname, 
      u.Phone AS BuyerPhone, 
      u.Zip AS BuyerZip, 
      u.Address AS BuyerAddress, 
      u.AddressDetail AS BuyerAddressDetail
    FROM 
      Products p
    JOIN 
      Customers c ON p.SellerID = c.CustomerID
    JOIN 
      Customers u ON u.CustomerID = ?
    WHERE 
      p.ProductID = ?`,
    [userId, productId],
    (error, results) => {
      if (error) {
        console.error("데이터 조회 오류:", error);
        return res.status(500).json({ success: false, message: "데이터 조회 오류" });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "상품을 찾을 수 없습니다." });
      }
      res.status(200).json({ success: true, data: results[0] });
    }
  );
});

// 주문 처리
router.post("/products/purchase/:productId", checkLogin, (req, res) => {
  const { productId } = req.params;
  const { sellPrice, shippingFee, deliveryAddress, deliveryDetailAddress } = req.body;
  const userId = req.session.user.CustomerID; // 세션에서 사용자 ID 가져오기
  const orderId = uuidv4().slice(0, 20); // 주문 ID 생성

  if (!deliveryAddress || !deliveryDetailAddress) {
    return res.status(400).json({ success: false, message: "배송지와 상세 주소를 입력해주세요." });
  }

  const totalPrice = sellPrice + (shippingFee || 3000);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("데이터베이스 연결 오류:", err);
      return res.status(500).json({ success: false, message: "데이터베이스 연결 오류" });
    }

    connection.beginTransaction((transactionError) => {
      if (transactionError) {
        console.error("트랜잭션 오류:", transactionError);
        connection.release();
        return res.status(500).json({ success: false, message: "트랜잭션 오류" });
      }

      // Orders 테이블에 데이터 삽입
      connection.query(
        `INSERT INTO Orders (OrderID, CustomerID, TotalPrice, ShippingFee, OrderDate)
         VALUES (?, ?, ?, ?, NOW())`,
        [orderId, userId, totalPrice, shippingFee],
        (orderError) => {
          if (orderError) {
            console.error("Orders 테이블 삽입 오류:", orderError);
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ success: false, message: "주문 생성 오류" });
            });
          }

          // OrderDetails 테이블에 데이터 삽입
          connection.query(
            `INSERT INTO OrderDetails (OrderID, ProductID, SellerID, CustomerID, SellPrice)
             VALUES (?, ?, (SELECT SellerID FROM Products WHERE ProductID = ?), ?, ?)`,
            [orderId, productId, productId, userId, sellPrice],
            (detailsError) => {
              if (detailsError) {
                console.error("OrderDetails 테이블 삽입 오류:", detailsError);
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ success: false, message: "주문 세부정보 생성 오류" });
                });
              }

              // Products 테이블 상태 업데이트 ("거래완료")
              connection.query(
                `UPDATE Products SET Status = '거래완료' WHERE ProductID = ?`,
                [productId],
                (updateError) => {
                  if (updateError) {
                    console.error("Products 상태 업데이트 오류:", updateError);
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ success: false, message: "상품 상태 업데이트 오류" });
                    });
                  }

                  connection.commit((commitError) => {
                    if (commitError) {
                      console.error("트랜잭션 커밋 오류:", commitError);
                      return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ success: false, message: "트랜잭션 커밋 오류" });
                      });
                    }

                    // 성공 응답
                    connection.release();
                    res.status(201).json({
                      success: true,
                      message: "주문이 성공적으로 완료되었습니다.",
                    });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
});

// 거래 상태 확인
router.get("/products/status/:productId", checkLogin, (req, res) => {
  const { productId } = req.params;

  pool.query(
    `SELECT Status FROM Products WHERE ProductID = ?`,
    [productId],
    (error, results) => {
      if (error) {
        console.error("상품 상태 조회 오류:", error);
        return res.status(500).json({ success: false, message: "상품 상태 조회 오류" });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "상품을 찾을 수 없습니다." });
      }
      res.status(200).json({ success: true, status: results[0].Status });
    }
  );
});

module.exports = router;