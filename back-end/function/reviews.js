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

// 거래 후기 조회
router.get("/:productId", (req, res) => {
  const { productId } = req.params;

  pool.query(
    `
    SELECT 
      r.ReviewID,
      r.ProductID,
      r.CustomerID,
      r.Rating,
      r.Comments,
      c.CustomerNickname
    FROM 
      Reviews r
    JOIN 
      Customers c ON r.CustomerID = c.CustomerID
    WHERE 
      r.ProductID = ?
    `,
    [productId],
    (error, results) => {
      if (error) {
        console.error("거래 후기 조회 오류:", error);
        return res.status(500).json({ success: false, message: "거래 후기 조회 오류" });
      }
      res.status(200).json({ success: true, reviews: results });
    }
  );
});

// 거래 후기 작성
router.post("/:productId", checkLogin, (req, res) => {
  const { productId } = req.params;
  const { rating, comments } = req.body;
  const userId = req.session.user.CustomerID;

  if (!rating || !comments.trim()) {
    return res.status(400).json({ success: false, message: "평점과 후기를 입력해주세요." });
  }

  // 구매자가 거래한 기록 확인
  pool.query(
    `
    SELECT * FROM OrderDetails
    WHERE ProductID = ? AND CustomerID = ?
    `,
    [productId, userId],
    (orderError, orderResults) => {
      if (orderError) {
        console.error("거래 기록 확인 오류:", orderError);
        return res.status(500).json({ success: false, message: "거래 기록 확인 오류" });
      }

      if (orderResults.length === 0) {
        return res.status(403).json({ success: false, message: "거래한 기록이 없는 사용자입니다." });
      }

      // 거래 후기 작성
      const reviewId = uuidv4().slice(0, 20); // 리뷰 ID 생성
      pool.query(
        `
        INSERT INTO Reviews (ReviewID, ProductID, CustomerID, Rating, Comments)
        VALUES (?, ?, ?, ?, ?)
        `,
        [reviewId, productId, userId, rating, comments],
        (insertError) => {
          if (insertError) {
            console.error("거래 후기 작성 오류:", insertError);
            return res.status(500).json({ success: false, message: "거래 후기 작성 오류" });
          }

          // 성공적으로 작성 후 최신 리뷰 반환
          pool.query(
            `
            SELECT 
              r.ReviewID,
              r.ProductID,
              r.CustomerID,
              r.Rating,
              r.Comments,
              c.CustomerNickname
            FROM 
              Reviews r
            JOIN 
              Customers c ON r.CustomerID = c.CustomerID
            WHERE 
              r.ProductID = ?
            `,
            [productId],
            (fetchError, reviews) => {
              if (fetchError) {
                console.error("최신 거래 후기 조회 오류:", fetchError);
                return res.status(500).json({ success: false, message: "최신 거래 후기 조회 오류" });
              }

              res.status(201).json({ success: true, reviews });
            }
          );
        }
      );
    }
  );
});

module.exports = router;