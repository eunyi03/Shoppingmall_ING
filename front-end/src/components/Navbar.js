import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <div className="navbar_all">
      <div className="navbar">
        <nav>
          <ul className="navbar_list">
            <li className="navbar_item">
              <Link className="navbar_link" to="/">Main</Link>
            </li>
            <li className="navbar_item">
              <Link className="navbar_link" to="/signup">회원가입</Link>
            </li>
            <li className="navbar_item">
              <Link className="navbar_link" to="/login">로그인</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
