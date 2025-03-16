"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa"; 

const Header = ({ isLoggedIn, balance }) => {
  const router = useRouter();

  return (
    <header className="header-container">
      {/* Left Side: Logo */}
      <div className="logo" onClick={() => router.push("/")}>
        <span className="logo-text">VortexCoin</span>
        <span className="logo-icon">🚀</span>
      </div>

      {/* Right Side: Conditional Rendering */}
      <div className="header-actions">
        {isLoggedIn ? (
          <div className="wallet-section">

            {/* Profile Icon */}
            <div className="profile-section" onClick={() => router.push("/profile")}>
              <FaUserCircle className="profile-icon" />
            </div>
            {/* Wallet Balance */}
            <div className="wallet-balance">
              <span className="wallet-icon">💰</span>
              <span className="balance-amount">{balance} Coins</span>
            </div>
            
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn login-btn" onClick={() => router.push("/login")}>Login</button>
            <button className="btn signup-btn" onClick={() => router.push("/signup")}>Sign Up</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
