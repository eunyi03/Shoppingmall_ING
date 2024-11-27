// server.js
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db_config = require('./config/db_config.json');
const app = express();
const cors = require('cors');
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 주소
    credentials: true, // 쿠키 허용
  })
);

// MySQL 세션 스토어 옵션
const sessionStoreOptions = {
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
};

const sessionStore = new MySQLStore(sessionStoreOptions);

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// URL을 인코딩하는 코드
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors());
app.use(
  session({
    key: 'session_cookie_name',
    secret: 'your_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    }, 
  })
);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../Front-end/build')));
app.use(express.static(path.join(__dirname, 'public')));

//js파일 연동
const loginRoutes = require('./function/login');
const processRoutes = require('./function/process');
const productsRoutes = require('./function/products');
const mypageRoutes = require('./function/mypage');
const ordersRoutes = require('./function/orders');
const reviewsRoutes = require('./function/reviews');

app.use('/', loginRoutes);
app.use('/', processRoutes);
app.use("/products", productsRoutes);
app.use('/mypage', mypageRoutes);
app.use('/', ordersRoutes);
app.use('/reviews', reviewsRoutes);

//모든 요청은 build/index.html로
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Front-end/build', 'index.html'));
});

// 서버 시작
app.listen(3000, () => {
  console.log('서버가 3000 포트에서 실행 중입니다.');
});
