import React from "react";
import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="app-header">
      <h1 className="header-title">Water Flow Monitor</h1>
      <nav className="header-nav">
        <ul>
          <li><NavLink to="/dashboard">Home</NavLink></li>
          <li><NavLink to="/history">History</NavLink></li>
          <li><NavLink to="/mail">Mail</NavLink></li>
        </ul>
      </nav>
      <div className="user-button-container">
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}