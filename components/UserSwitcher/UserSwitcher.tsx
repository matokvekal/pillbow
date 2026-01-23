import React, { useState, useRef, useEffect, useCallback } from "react";
import { useUserStore } from "../../store/useUserStore";
import { AddUserModal } from "./AddUserModal";
import "./UserSwitcher.css";

// Constants for UI elements
const DEFAULT_AVATAR = "👤";
const ADD_USER_ICON = "➕";
const CHECK_ICON = "✓";
const SELF_LABEL = "Me";
const CHEVRON_SIZE = 12;
const CHEVRON_VIEWBOX = "0 0 24 24";

/**
 * ChevronIcon component - Reusable dropdown indicator
 */
const ChevronIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg
    className="chevron-down"
    width={size}
    height={size}
    viewBox={CHEVRON_VIEWBOX}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * UserOption component - Individual user option in dropdown
 */
interface UserOptionProps {
  id: string;
  name: string;
  avatar: string;
  relationship: string;
  isActive: boolean;
  onSelect: (userId: string) => void;
}

const UserOption: React.FC<UserOptionProps> = ({
  id,
  name,
  avatar,
  relationship,
  isActive,
  onSelect,
}) => (
  <button
    className={`user-option ${isActive ? "active" : ""}`}
    onClick={() => onSelect(id)}
  >
    <span className="option-avatar">{avatar}</span>
    <div className="option-info">
      <span className="option-name">{name}</span>
      <span className="option-role">
        {relationship === "self" ? `(${SELF_LABEL})` : `(${relationship})`}
      </span>
    </div>
    {isActive && <span className="check-icon">{CHECK_ICON}</span>}
  </button>
);

export const UserSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { users, currentUserId, switchUser, getCurrentUser } = useUserStore();
  const currentUser = getCurrentUser();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Closes dropdown when clicking outside
   * Improves accessibility and UX
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Handles user selection from dropdown
   */
  const handleSelectUser = useCallback(
    (userId: string) => {
      switchUser(userId);
      setIsOpen(false);
    },
    [switchUser],
  );

  /**
   * Handles adding a new family member
   */
  const handleAddMember = useCallback(() => {
    setIsOpen(false);
    setShowAddModal(true);
  }, []);

  return (
    <div className="user-switcher" ref={dropdownRef}>
      <button
        className="current-user-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch user"
        aria-expanded={isOpen}
      >
        <span className="user-avatar">
          {currentUser?.avatar || DEFAULT_AVATAR}
        </span>
        <span className="user-name">{currentUser?.name || SELF_LABEL}</span>
        <ChevronIcon size={CHEVRON_SIZE} />
      </button>

      {isOpen && (
        <div className="user-dropdown" role="menu">
          {users.map((user) => (
            <UserOption
              key={user.id}
              id={user.id}
              name={user.name}
              avatar={user.avatar}
              relationship={user.relationship}
              isActive={user.id === currentUserId}
              onSelect={handleSelectUser}
            />
          ))}

          <div className="dropdown-divider" />

          <button
            className="add-user-btn"
            onClick={handleAddMember}
            role="menuitem"
          >
            <span className="add-icon">{ADD_USER_ICON}</span>
            Add Family Member
          </button>
        </div>
      )}

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
