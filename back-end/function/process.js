// /process를 통해 server에 있는 정보를 줄 때 이 파일을 통해 주게됨
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/check-login', (req, res) => {
  console.log('/check-login 호출됨'); // 디버깅용 로그asdas
  if (req.session.user) {
    console.log('로그인 상태 확인됨'); // 디버깅용 로그
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    console.log('로그인 상태 아님'); // 디버깅용 로그
    res.json({ loggedIn: false });
  }
});

// 로그아웃 구현
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('세션 종료 중 오류 발생:', err);
      return res.status(500).send('로그아웃 중 오류가 발생했습니다.');
    }
    res.clearCookie('session_cookie_name');
    return res.status(200).send();
  });
});

//app과 router 연동
router.use('/process', router);
module.exports = router;
