const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mysql = require("mysql");
const db_config = require("../config/db_config.json");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// 로그인 처리
router.post("/process/loginpage", (req, res) => {
  console.log("/login 호출됨", req.body);
  const paramID = req.body.customerid; // 고객 ID
  const paramPW = req.body.password; // 비밀번호

  console.log("로그인 요청: ID = " + paramID + ", PW = " + paramPW);
  pool.getConnection((err, conn) => {
    if (err) {
      console.log("MySQL Connection Error", err);
      if (conn) conn.release();
      return res.status(500).json({ success: false, message: "DB 서버 연결 실패" });
    }

    // 로그인 쿼리 실행
    conn.query(
      "SELECT customerid, customernickname, password FROM Customers WHERE customerid = ?",
      [paramID],
      async (err, rows) => {
        conn.release();
        if (err) {
          console.error("Query 실행 오류:", err);
          return res.status(500).json({ success: false, message: "Query 실패" });
        }

        if (rows.length > 0) {
          const user = rows[0];
          console.log("DB에서 찾은 사용자:", user);

          // 비밀번호 확인
          const match = await bcrypt.compare(paramPW, user.password);
          if (match) {
            console.log(
              "로그인 성공: ID = [%s], 닉네임 = [%s]",
              paramID,
              user.customernickname
            );
            req.session.user = {
              CustomerID: user.customerid,
              CustomerNickname: user.customernickname,
              authorized: true,
            };

            // 세션 저장
            req.session.save((err) => {
              if (err) {
                console.error("세션 저장 오류:", err);
                return res.status(500).json({ success: false, message: "세션 저장 실패" });
              }
              console.log("세션 저장 완료:", req.session.user);
              res.json({ success: true });
            });
          } else {
            console.log("비밀번호 불일치: 입력된 PW = [%s]", paramPW);
            res.status(401).json({ success: false, message: "패스워드가 일치하지 않음" });
          }
        } else {
          console.log("로그인 실패: ID [%s]와 일치하는 사용자 없음", paramID);
          res.status(401).json({
            success: false,
            message: "아이디 또는 패스워드가 일치하지 않음",
          });
        }
      }
    );
  });
});

// 회원가입 처리
router.post("/process/signuppage", async (req, res) => {
  console.log("/signup 호출됨", req.body);

  const paramID = req.body.customerid; // 고객 ID
  const paramNickname = req.body.customernickname; // 닉네임
  const paramPW = req.body.password; // 비밀번호
  const paramPhone = req.body.phone; // 전화번호
  const paramZip = req.body.zip; // 우편번호
  const paramAddress = req.body.address; // 주소
  const paramAddressDetail = req.body.addressdetail; // 상세 주소
  const paramAccount = req.body.account; // 계좌번호

  try {
    const hashedPassword = await bcrypt.hash(paramPW, 10);

    pool.getConnection((err, conn) => {
      if (err) {
        console.log("MySQL Connection Error", err);
        if (conn) conn.release();
        return res.json({ success: false, message: "DB 서버 연결 실패" });
      }
      console.log("데이터베이스 연결 성공");

      // 회원가입 쿼리 실행
      const exec = conn.query(
        "INSERT INTO Customers (customerid, customernickname, password, phone, zip, address, addressdetail, account) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        [
          paramID,
          paramNickname,
          hashedPassword,
          paramPhone,
          paramZip,
          paramAddress,
          paramAddressDetail,
          paramAccount,
        ],
        (err, result) => {
          conn.release();
          console.log("실행된 SQL: " + exec.sql);

          if (err) {
            console.log("SQL 실행 오류 발생", err);
            return res.json({
              success: false,
              message: "Query 실패 (중복된 ID, 닉네임 또는 전화번호)",
            });
          }

          if (result) {
            console.log("회원가입 성공");
            return res.json({ success: true, message: "회원가입 성공" });
          } else {
            console.log("회원가입 실패");
            return res.json({ success: false, message: "사용자 추가 실패" });
          }
        }
      );
    });
  } catch (error) {
    console.log("비밀번호 해싱 오류", error);
    return res.json({ success: false, message: "비밀번호 해싱 실패" });
  }
});

// 로그아웃 처리
router.post("/process/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        console.error("로그아웃 중 오류:", err);
        return res.status(500).json({ success: false, message: "로그아웃 실패" });
      }
      console.log("로그아웃 성공");
      res.json({ success: true, message: "로그아웃 성공" });
    });
  } else {
    res.status(400).json({ success: false, message: "로그인 상태가 아님" });
  }
});

// app과 router 연동
module.exports = router;