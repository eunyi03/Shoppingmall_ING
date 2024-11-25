//회원가입 페이지
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mysql = require("mysql");
const db_config = require("../config/db_config.json");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

router.post("/process/signup", async (req, res) => {
  console.log("/signup 호출됨", req.body);

  const paramCustomerID = req.body.customer_id;
  const paramCustomerNickname = req.body.customer_nickname;
  const paramPassword = req.body.password;
  const paramPhone = req.body.phone;
  const paramZip = req.body.zip;
  const paramAddress = req.body.address;
  const paramAddressDetail = req.body.address_detail;
  const paramAccount = req.body.account;

  try {
    const hashedPassword = await bcrypt.hash(paramPassword, 10);

    pool.getConnection((err, conn) => {
      if (err) {
        console.log("MySQL Connection Error", err);
        if (conn) conn.release();
        return res.json({ success: false, message: "DB 서버 연결 실패" });
      }
      console.log("데이터베이스 연결 성공");

      const exec = conn.query(
        `INSERT INTO Customers (
          CustomerID, CustomerNickname, Password, Phone, Zip, Address, AddressDetail, Account
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          paramCustomerID,
          paramCustomerNickname,
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
            console.log("SQL 실행 시 오류 발생", err);
            return res.json({ success: false, message: "Query 실패" });
          }

          if (result) {
            console.dir(result);
            console.log("insert 성공");
            return res.json({ success: true, message: "회원가입 성공" });
          } else {
            console.log("insert 실패");
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
router.use("/loginpage", router);
module.exports = router;