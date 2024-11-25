import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';  // Navbar 컴포넌트를 임포트합니다.
import Loginpage from './components/mypage/Loginpage.js';
import Signuppage from './components/mypage/Signuppage.js';
import Deal from './components/Product/Deal.js';
import Write from './components/Product/Write.js';
import DealRead from './components/Product/DealRead.js';  // ProductRead 컴포넌트를 임포트합니다.
import DealEdit from './components/Product/DealEdit.js';  // ProductEdit 컴포넌트를 임포트합니다.
import Mypage from './components/mypage/Mypage.js';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <div className="content">
        <Routes>
          <Route path="/" element={<Deal />} />
          {/* <Route path="/productread" element={<DealRead />} /> */}
          <Route path="/products/detail/:productId" element={<DealRead />} />
          <Route path="/signup" element={<Signuppage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/write" element={<Write />} />
          {/* <Route path="/edit" element={<DealEdit />} /> */}
          <Route path="/products/update/:productId" element={<DealEdit />} />
          <Route path="/products/process/delete/:productId" element={<DealEdit />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
