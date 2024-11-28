CREATE TABLE `Categories` (
  `CategoryID` varchar(5) NOT NULL,
  `CategoryName` varchar(100) NOT NULL,
  PRIMARY KEY (`CategoryID`),
  UNIQUE KEY `CategoryName` (`CategoryName`)
);

CREATE TABLE `Customers` (
  `CustomerID` varchar(20) NOT NULL,
  `CustomerNickname` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Phone` varchar(15) NOT NULL,
  `Zip` varchar(10) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `AddressDetail` varchar(255) NOT NULL,
  `Account` varchar(30) NOT NULL,
  PRIMARY KEY (`CustomerID`),
  UNIQUE KEY `CustomerNickname` (`CustomerNickname`),
  UNIQUE KEY `Phone` (`Phone`)
);

CREATE TABLE 'OrderDetails' (
  'OrderID' varchar(20) NOT NULL,
  'ProductID' varchar(20) NOT NULL,
  'SellerID' varchar(20) NOT NULL,
  'CustomerID' varchar(20) NOT NULL,
  'SellPrice' int NOT NULL,
  PRIMARY KEY ('OrderID','ProductID'),
  KEY 'fk_ProductID_Details' ('ProductID'),
  KEY 'fk_CustomerID_OrderDetails' ('CustomerID'),
  CONSTRAINT 'fk_CustomerID_OrderDetails' FOREIGN KEY ('CustomerID') 
  REFERENCES 'Customers' ('CustomerID') ON DELETE CASCADE,
  CONSTRAINT 'fk_OrderID_Details' FOREIGN KEY ('OrderID') 
  REFERENCES 'Orders' ('OrderID') ON DELETE CASCADE,
  CONSTRAINT 'fk_ProductID_Details' FOREIGN KEY ('ProductID') 
  REFERENCES 'Products' ('ProductID') ON DELETE CASCADE
);

CREATE TABLE 'Orders' (
  'OrderID' varchar(20) NOT NULL,
  'CustomerID' varchar(20) NOT NULL,
  'OrderDate' timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  'TotalPrice' int NOT NULL,
  'ShippingFee' int NOT NULL DEFAULT '3000',
  PRIMARY KEY ('OrderID'),
  KEY 'fk_CustomerID_Order' ('CustomerID'),
  CONSTRAINT 'fk_CustomerID_Order' FOREIGN KEY ('CustomerID') 
  REFERENCES 'Customers' ('CustomerID') ON DELETE CASCADE
);

CREATE TABLE `Products` (
  `ProductID` varchar(20) NOT NULL,
  `SellerID` varchar(20) NOT NULL,
  `CategoryID` varchar(5) NOT NULL DEFAULT 'C4',
  `ProductName` varchar(100) NOT NULL,
  `OriginPrice` int NOT NULL,
  `Discount` decimal(5,2) DEFAULT NULL,
  `SellPrice` int NOT NULL,
  `ProductImage` longblob,
  `Description` text NOT NULL,
  `RegisterDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Status` varchar(20) NOT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `fk_CategoryID` (`CategoryID`),
  CONSTRAINT `fk_CategoryID` FOREIGN KEY (`CategoryID`) REFERENCES `Categories` (`CategoryID`),
  CONSTRAINT `Category_type` CHECK ((`CategoryID` in (_utf8mb4'기타',_utf8mb4'도서',_utf8mb4'악세서리',_utf8mb4'의류')))
);

CREATE TABLE `Reviews` (
  `ReviewID` varchar(20) NOT NULL,
  `ProductID` varchar(20) NOT NULL,
  `CustomerID` varchar(20) NOT NULL,
  `Rating` int DEFAULT NULL,
  `Comments` text NOT NULL,
  PRIMARY KEY (`ReviewID`,`ProductID`),
  KEY `fk_ProductID` (`ProductID`),
  KEY `fk_CustomerID` (`CustomerID`),
  CONSTRAINT `fk_CustomerID` FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`CustomerID`) ON DELETE CASCADE,
  CONSTRAINT `fk_ProductID` FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`) ON DELETE CASCADE,
  CONSTRAINT `Reviews_chk_1` CHECK ((`Rating` between 1 and 5))
);

CREATE TABLE `ShoppingCart` (
  `RecordID` varchar(20) NOT NULL,
  `CustomerID` varchar(20) NOT NULL,
  `ProductID` varchar(20) NOT NULL,
  PRIMARY KEY (`RecordID`),
  KEY `fk_CustomerID_Shop` (`CustomerID`),
  KEY `fk_ProductID_Shop` (`ProductID`),
  CONSTRAINT `fk_CustomerID_Shop` FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`CustomerID`) ON DELETE CASCADE,
  CONSTRAINT `fk_ProductID_Shop` FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`) ON DELETE CASCADE
);