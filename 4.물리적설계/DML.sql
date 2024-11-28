-- login.js 파일
-- Customers 테이블에 회원가입 쿼리 실행
INSERT INTO Customers (customerid, customernickname, password, phone, zip, address, addressdetail, account) VALUES (?, ?, ?, ?, ?, ?, ?, ?)

-- 로그인 쿼리 실행
SELECT customerid, customernickname, password FROM Customers WHERE customerid = ?


-- mypage.js
-- 마이페이지 회원 정보 불러오기
SELECT CustomerID, CustomerNickname, Phone, Zip, Address, AddressDetail, Account FROM Customers WHERE CustomerID = ?

-- 마이페이지 내가 작성한 글 불러오기
SELECT ProductID, ProductName, SellPrice, Discount, Status, RegisterDate FROM Products WHERE SellerID = ?

-- 마이페이지 내가 거래한 글 내역 조회
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
      
-- 마이페이지 장바구니 내역 조회
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


-- orders.js
-- 거래하기 폼 불러오기
SELECT 
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
      p.ProductID = ?
      
-- Orders 테이블에 데이터 삽입
INSERT INTO Orders (OrderID, CustomerID, TotalPrice, ShippingFee, OrderDate)
         VALUES (?, ?, ?, ?, NOW())
         
-- OrderDetails 테이블에 데이터 삽입
INSERT INTO OrderDetails (OrderID, ProductID, SellerID, CustomerID, SellPrice)
             VALUES (?, ?, (SELECT SellerID FROM Products WHERE ProductID = ?), ?, ?)
             
-- Products 테이블 거래상태 업데이트
UPDATE Products SET Status = '거래완료' WHERE ProductID = ?

-- 거래상태 확인 (상품이 거래중인지 거래완료인지)
SELECT Status FROM Products WHERE ProductID = ?


-- products.js
-- Products 테이블에 정보 삽입
INSERT INTO Products (ProductID, SellerID, CategoryID, ProductName, OriginPrice, Discount, SellPrice, ProductImage, Description, Status, RegisterDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      
-- 거래하기 등록한 글 목록 조회
SELECT 
        p.ProductID, p.ProductName, c.CustomerNickname AS SellerNickname, 
        p.SellPrice, p.Discount, p.RegisterDate, p.Status, p.CategoryID
      FROM Products p
      JOIN Customers c ON p.SellerID = c.CustomerID
      
-- 거래하기 등록된 글 상세보기 조회
SELECT 
      p.ProductID, p.ProductName, p.CategoryID, c.CustomerNickname AS SellerNickname, 
      p.OriginPrice, p.SellPrice, p.Discount, p.Description, p.Status, p.RegisterDate, p.SellerID
    FROM Products p
    JOIN Customers c ON p.SellerID = c.CustomerID
    WHERE p.ProductID = ?
    
-- 거래하기 등록된 글 작성자만 수정 권한
UPDATE Products
    SET CategoryID = ?, ProductName = ?, OriginPrice = ?, SellPrice = ?, Discount = ?, Description = ?, Status = ?
    
-- 거래하기 등록된 글 작성자만 삭제 권한
DELETE FROM Products
    WHERE ProductID = ? AND SellerID = ?
    
-- 거래하기 등록시 상품 이미지 서빙
SELECT ProductImage FROM Products WHERE ProductID = ?

-- 상품 장바구니에 추가
INSERT INTO ShoppingCart (RecordID, CustomerID, ProductID)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE RecordID = RecordID; -- Avoid duplication
      

-- reviews.js
-- 거래완료된 글 거래후기 조회
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
      
-- 거래후기 작성시 이미 해당 상품에 대한 후기를 작성했는지 확인 (거래후기는 구매자도 한 번만 입력 가능)
SELECT * FROM Reviews
    WHERE ProductID = ? AND CustomerID = ?
    
-- 거래후기 작성은 구매자만 입력 가능 -> 구매자가 거래한 기록 확인
SELECT * FROM OrderDetails
        WHERE ProductID = ? AND CustomerID = ?
        
-- 거래후기 작성
INSERT INTO Reviews (ReviewID, ProductID, CustomerID, Rating, Comments)
            VALUES (?, ?, ?, ?, ?)
            
-- 거래후기 성공적으로 작성 후 최신 거래후기 반환
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


