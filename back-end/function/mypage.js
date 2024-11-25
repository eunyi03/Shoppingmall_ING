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
router.get("/mypage/info", checkLogin, (req, res) => {
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
router.get("/mypage/posts", checkLogin, (req, res) => {
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
router.get("/mypage/transactions", checkLogin, (req, res) => {
  const userId = req.session.user.CustomerID;

  console.log("거래한 글 요청:", userId); // 디버깅 로그

  pool.query(
    `SELECT t.ProductID, p.ProductName, p.SellPrice, t.OrderDate, t.SellerID 
     FROM Transactions t 
     JOIN Products p ON t.ProductID = p.ProductID 
     WHERE t.BuyerID = ?`,
    [userId],
    (error, results) => {
      if (error) {
        console.error("거래 목록 조회 오류:", error);
        return res.status(500).json({ error: "거래 목록 조회 오류" });
      }
      res.json({ success: true, data: results });
    }
  );
});

module.exports = router;
