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


const checkLogin = (req, res, next) => {
    console.log("세션 상태:", req.session); // 디버깅용
    const user = req.session?.user;
    if (!user || !user.CustomerID) {
      return res.status(401).send("로그인이 필요합니다.");
    }
    next();
  };


router.post("/register", checkLogin, upload.single("ProductImage"), (req, res) => {
    const { CategoryID, ProductName, OriginPrice, SellPrice, Description, Status } = req.body;
    const SellerID = req.session.user.CustomerID;
    const ProductID = `prod_${Date.now()}`;
    const Discount = Math.round(((OriginPrice - SellPrice) / OriginPrice) * 100);
    const ProductImage = req.file ? req.file.buffer : null;
    const status = Status || "거래중"; // 기본값 설정
    const RegisterDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  
    const query = `
      INSERT INTO Products (ProductID, SellerID, CategoryID, ProductName, OriginPrice, Discount, SellPrice, ProductImage, Description, Status, RegisterDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  
    pool.query(
      query,
      [ProductID, SellerID, CategoryID, ProductName, OriginPrice, Discount, SellPrice, ProductImage, Description, status, RegisterDate],
      (error) => {
        if (error) {
          console.error("상품 등록 오류:", error);
          return res.status(500).json({ error: "상품 등록 오류" });
        }
        res.status(201).json({ message: "상품이 성공적으로 등록되었습니다." });
      }
    );
  });

router.get("/list", (req, res) => {
    const category = req.query.category;
  
    let query = `
      SELECT 
        p.ProductID, p.ProductName, c.CustomerNickname AS SellerNickname, 
        p.SellPrice, p.Discount, p.RegisterDate, p.Status, p.CategoryID
      FROM Products p
      JOIN Customers c ON p.SellerID = c.CustomerID
    `;
  
    const queryParams = [];
  
    if (category && category !== "전체") {
      query += " WHERE p.CategoryID = ?";
      queryParams.push(category);
    }
  
    query += " ORDER BY p.RegisterDate DESC;";
  
    pool.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("상품 목록 조회 오류:", error);
        return res.status(500).json({ error: "상품 목록 조회 오류" });
      }
  
      const products = results.map((product) => ({
        ...product,
        ProductImageURL: `/products/image/${product.ProductID}`,
      }));
  
      res.json(products);
    });
  });

router.get("/detail/:productId", (req, res) => {
  const ProductID = req.params.productId;
  const currentUserId = req.session.user ? req.session.user.CustomerID : null;

  console.log("현재 로그인된 사용자 ID:", currentUserId); // 디버깅 로그

  const query = `
    SELECT 
      p.ProductID, p.ProductName, p.CategoryID, c.CustomerNickname AS SellerNickname, 
      p.OriginPrice, p.SellPrice, p.Discount, p.Description, p.Status, p.RegisterDate, p.SellerID
    FROM Products p
    JOIN Customers c ON p.SellerID = c.CustomerID
    WHERE p.ProductID = ?;
  `;

  pool.query(query, [ProductID], (error, results) => {
    if (error) {
      console.error("상품 상세보기 오류:", error);
      return res.status(500).json({ error: "상품 상세보기 오류" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    const product = {
      ...results[0],
      ProductImageURL: `/products/image/${results[0].ProductID}`,
      CurrentUserId: currentUserId, // 현재 로그인된 사용자 ID 추가
    };

    console.log("응답 데이터:", product); // 디버깅 로그

    res.json(product);
  });
});

/// 상품 수정
router.put("/update/:productId", checkLogin, upload.single("ProductImage"), (req, res) => {
  const { CategoryID, ProductName, OriginPrice, SellPrice, Description, Status } = req.body;
  const ProductID = req.params.productId;
  const SellerID = req.session.user.CustomerID; // 로그인된 사용자 ID
  const Discount = Math.round(((OriginPrice - SellPrice) / OriginPrice) * 100);
  const ProductImage = req.file ? req.file.buffer : null;

  let query = `
    UPDATE Products
    SET CategoryID = ?, ProductName = ?, OriginPrice = ?, SellPrice = ?, Discount = ?, Description = ?, Status = ?
  `;
  const queryParams = [
    CategoryID,
    ProductName,
    OriginPrice,
    SellPrice,
    Discount,
    Description,
    Status,
  ];

  if (ProductImage) {
    query += ", ProductImage = ?";
    queryParams.push(ProductImage);
  }

  query += " WHERE ProductID = ? AND SellerID = ?";
  queryParams.push(ProductID, SellerID);

  pool.query(query, queryParams, (error, results) => {
    if (error) {
      console.error("상품 수정 오류:", error);
      return res.status(500).json({ error: "상품 수정 오류" });
    }
    if (results.affectedRows === 0) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }
    res.json({ message: "상품이 성공적으로 수정되었습니다." });
  });
});

router.delete("/delete/:productId", (req, res) => {
  const ProductID = req.params.productId;
  const SellerID = req.session.user.CustomerID;

  const query = `
    DELETE FROM Products
    WHERE ProductID = ? AND SellerID = ?;
  `;

  pool.query(query, [ProductID, SellerID], (error, results) => {
    if (error) {
      console.error("상품 삭제 오류:", error);
      return res.status(500).json({ error: "상품 삭제 오류" });
    }
    if (results.affectedRows === 0) {
      return res.status(403).json({ error: "삭제 권한이 없습니다." });
    }
    res.json({ message: "상품이 성공적으로 삭제되었습니다." });
  });
});


// 상품 이미지 서빙
router.get("/image/:productId", (req, res) => {
  const productId = req.params.productId;

  pool.query("SELECT ProductImage FROM Products WHERE ProductID = ?", [productId], (error, results) => {
    if (error) {
      console.error("이미지 서빙 오류:", error);
      return res.status(500).json({ error: "이미지 서빙 오류" });
    }

    if (results.length === 0 || !results[0].ProductImage) {
        return res.status(404).send("이미지를 찾을 수 없습니다.");
      }
  
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(results[0].ProductImage);
    });
  });
  
  module.exports = router;

// 장바구니에 추가
router.post("/cart", checkLogin, (req, res) => {
  const { productId } = req.body;
  const customerId = req.session.user.CustomerID;
  const recordId = `cart_${Date.now()}`; // Unique RecordID

  const query = `
      INSERT INTO ShoppingCart (RecordID, CustomerID, ProductID)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE RecordID = RecordID; -- Avoid duplication
  `;

  pool.query(query, [recordId, customerId, productId], (error, results) => {
      if (error) {
          console.error("장바구니 추가 오류:", error);
          return res.status(500).json({ error: "장바구니 추가 오류" });
      }
      res.json({ message: "장바구니에 성공적으로 추가되었습니다." });
  });
});
