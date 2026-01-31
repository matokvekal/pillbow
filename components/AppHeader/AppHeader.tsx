import React from "react";
import { UserSwitcher } from "../UserSwitcher/UserSwitcher";
import { ReminderBell } from "../ReminderBell/ReminderBell";
import "./AppHeader.css";

interface AppHeaderProps {
  onMenuClick: () => void;
  onTodayClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick, onTodayClick }) => {
  return (
    <header className="app-header">
      <div className="app-header__logo-container">
        {/* PillBow Logo - Capsule with rainbow gradient border */}
        <div className="app-header__capsule-logo">
          <h1 className="app-header__title">
            <span className="app-header__letter app-header__letter--p">P</span>
            <span className="app-header__letter app-header__letter--i">i</span>
            <span className="app-header__letter app-header__letter--l1">l</span>
            <span className="app-header__letter app-header__letter--l2">l</span>
            <span className="app-header__letter app-header__letter--b">B</span>
            <span className="app-header__letter app-header__letter--o">o</span>
            <span className="app-header__letter app-header__letter--w">w</span>
          </h1>
        </div>
      </div>

      {/* User Switcher - for family member selection */}
      <UserSwitcher />

      <ReminderBell />

      {onTodayClick && (
        <button
          onClick={onTodayClick}
          className="app-header__today-btn"
          aria-label="Go to today"
        >
          Today
        </button>
      )}

      <button
        onClick={() => onMenuClick()}
        className="app-header__menu-btn"
        aria-label="Settings"
      >
        <svg className="app-header__menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </header>
  );
};
