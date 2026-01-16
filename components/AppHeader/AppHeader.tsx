import React from "react";
import "./AppHeader.css";

interface AppHeaderProps {
  onMenuClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="app-header">
      <div className="app-header__logo-container">
        <div className="app-header__logo">
          <span className="app-header__logo-text">P</span>
        </div>
        <h1 className="app-header__title">
          <span className="app-header__letter app-header__letter--p">p</span>
          <span className="app-header__letter app-header__letter--i">i</span>
          <span className="app-header__letter app-header__letter--l1">l</span>
          <span className="app-header__letter app-header__letter--l2">l</span>
          <span className="app-header__letter app-header__letter--b">B</span>
          <span className="app-header__letter app-header__letter--o">o</span>
          <span className="app-header__letter app-header__letter--w">w</span>
        </h1>
      </div>
      <button
        onClick={onMenuClick}
        className="app-header__menu-btn"
        aria-label="Open menu"
      >
        <svg
          className="app-header__menu-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16M4 12h16M4 18h7" strokeWidth="2.5" />
        </svg>
      </button>
    </header>
  );
};
