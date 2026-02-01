import React, { useState, useRef, useEffect, useCallback } from "react";
import { useUserStore } from "../../store/useUserStore";
import { useModalStore } from "../../store/useModalStore";
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
 * TrashIcon component - SVG trash icon for delete button
 */
const TrashIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" strokeLinecap="round" strokeLinejoin="round"/>
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
  onDelete?: (userId: string) => void;
}

const UserOption: React.FC<UserOptionProps> = ({
  id,
  name,
  avatar,
  relationship,
  isActive,
  onSelect,
  onDelete,
}) => {
  const isImageAvatar = avatar && (avatar.startsWith('http') || avatar.startsWith('/'));

  return (
    <div className="user-option-wrapper">
      <button
        className={`user-option ${isActive ? "active" : ""}`}
        onClick={() => onSelect(id)}
      >
        <span className="option-avatar">
          {isImageAvatar ? (
            <img src={avatar} alt={name} className="option-avatar-img" />
          ) : (
            avatar
          )}
        </span>
        <div className="option-info">
          <span className="option-name">{name}</span>
          <span className="option-role">
            {relationship === "self" ? `(${SELF_LABEL})` : `(${relationship})`}
          </span>
        </div>
        {isActive && <span className="check-icon">{CHECK_ICON}</span>}
      </button>
      {onDelete && !isActive && (
        <button
          className="delete-user-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          aria-label={`Delete ${name}`}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export const UserSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { users, currentUserId, switchUser, removeUser, getCurrentUser } = useUserStore();
  const { clearStack } = useModalStore();
  const currentUser = getCurrentUser();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
   * Handles deleting a family member
   */
  const handleDeleteUser = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      const confirmed = window.confirm(
        `Remove ${user.name}?\n\nThis will delete all their medications and history.`
      );
      if (confirmed) {
        removeUser(userId);
        setIsOpen(false);
      }
    },
    [users, removeUser],
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
        ref={buttonRef}
        className="current-user-btn"
        onClick={() => {
          if (!isOpen) {
            clearStack();
          }
          setIsOpen(!isOpen);
        }}
        aria-label="Switch user"
        aria-expanded={isOpen}
      >
        <span className="user-avatar">
          {currentUser?.avatar && (currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('/')) ? (
            <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar-img" />
          ) : (
            currentUser?.avatar || DEFAULT_AVATAR
          )}
        </span>
        <span className="user-name">{currentUser?.name || SELF_LABEL}</span>
        <ChevronIcon size={CHEVRON_SIZE} />
      </button>

      {isOpen && (
        <div
          className="user-dropdown"
          role="menu"
          style={{
            top: buttonRef.current
              ? buttonRef.current.getBoundingClientRect().bottom + 8
              : 0,
          }}
        >
          {users.map((user) => (
            <UserOption
              key={user.id}
              id={user.id}
              name={user.name}
              avatar={user.avatar || DEFAULT_AVATAR}
              relationship={user.relationship}
              isActive={user.id === currentUserId}
              onSelect={handleSelectUser}
              onDelete={users.length > 1 ? handleDeleteUser : undefined}
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
