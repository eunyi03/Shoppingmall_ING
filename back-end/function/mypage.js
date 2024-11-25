const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const moment = require("moment-timezone");
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });

// 세션 사용자 확인
const checkLogin = (req, res, next) => {
  console.log("세션 상태:", req.session); // 디버깅 로그
  const user = req.session?.user;
  if (!user || !user.CustomerID) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }
  next();
};

// 회원 정보 조회
router.get("/info", checkLogin, (req, res) => {
  const userId = req.session.user.CustomerID;

  console.log("회원 정보 요청:", userId); // 디버깅 로그

  pool.query(
    "SELECT CustomerID, CustomerNickname, Phone, Zip, Address, AddressDetail, Account FROM Customers WHERE CustomerID = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("회원 정보 조회 오류:", error);
        return res.status(500).json({ error: "회원 정보 조회 오류" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "회원 정보를 찾을 수 없습니다." });
      }
      res.json({ success: true, data: results[0] });
    }
  );
});

// 내가 작성한 글
router.get("/posts", checkLogin, (req, res) => {
  const userId = req.session.user.CustomerID;

  console.log("작성 글 요청:", userId); // 디버깅 로그

  pool.query(
    "SELECT ProductID, ProductName, SellPrice, Discount, Status, RegisterDate FROM Products WHERE SellerID = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("작성 글 조회 오류:", error);
        return res.status(500).json({ error: "작성 글 조회 오류" });
      }
      res.json({ success: true, data: results });
    }
  );
});

// 내가 거래한 글
router.get("/transactions", checkLogin, (req, res) => {
  const userId = req.session.user.CustomerID;

  console.log("거래한 글 요청:", userId); // 디버깅 로그

  // 거래 내역 조회 쿼리
  pool.query(
    `
    SELECT 
      od.ProductID, 
      p.ProductName, 
      od.SellPrice, 
      o.OrderDate, 
      od.SellerID, 
      s.CustomerNickname AS SellerNickname
    FROM 
      OrderDetails od
    JOIN 
      Orders o ON od.OrderID = o.OrderID
    JOIN 
      Products p ON od.ProductID = p.ProductID
    JOIN 
      Customers s ON od.SellerID = s.CustomerID
    WHERE 
      od.CustomerID = ?
    ORDER BY 
      o.OrderDate DESC
    `,
    [userId],
    (error, results) => {
      if (error) {
        console.error("거래 목록 조회 오류:", error);
        return res.status(500).json({ error: "거래 목록 조회 오류" });
      }

      if (results.length === 0) {
        console.warn("거래 내역이 없습니다.");
        return res.status(404).json({ success: false, message: "거래 내역이 없습니다." });
      }

      res.status(200).json({ success: true, data: results });
    }
  );
});




// // 장바구니 조회 API
// router.get("/cart", checkLogin, (req, res) => {
//   const userId = req.session.user.CustomerID;

//   pool.query(
//     `
//     SELECT 
//       sc.ProductID, 
//       p.ProductName, 
//       p.SellPrice, 
//       p.Discount, 
//       c.CustomerNickname AS SellerNickname
//     FROM 
//       ShoppingCart sc
//     JOIN 
//       Products p ON sc.ProductID = p.ProductID
//     JOIN 
//       Customers c ON p.SellerID = c.CustomerID
//     WHERE 
//       sc.CustomerID = ?
//     `,
//     [userId],
//     (error, results) => {
//       if (error) {
//         console.error("장바구니 조회 오류:", error);
//         return res.status(500).json({ success: false, message: "장바구니를 불러오지 못했습니다." });
//       }

//       res.status(200).json({
//         success: true,
//         data: results,
//       });
//     }
//   );
// });

router.get("/cart", checkLogin, (req, res) => {
  const userId = req.session.user.CustomerID;

  pool.query(
    `
    SELECT 
      sc.ProductID, 
      p.ProductName, 
      p.SellPrice, 
      p.Discount, 
      c.CustomerNickname AS SellerNickname
    FROM 
      ShoppingCart sc
    JOIN 
      Products p ON sc.ProductID = p.ProductID
    JOIN 
      Customers c ON p.SellerID = c.CustomerID
    WHERE 
      sc.CustomerID = ?
    `,
    [userId],
    (error, results) => {
      if (error) {
        console.error("장바구니 조회 오류:", error);
        return res.status(500).json({ success: false, message: "장바구니를 불러오지 못했습니다." });
      }

      console.log("장바구니 조회 결과:", results); // 디버깅 로그
      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
});


module.exports = router;