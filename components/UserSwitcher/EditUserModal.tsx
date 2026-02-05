import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { UserProfile } from '../../types';
import './UserSwitcher.css';

interface EditUserModalProps {
    user: UserProfile;
    onClose: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose }) => {
    const { updateUser } = useUserStore();
    const [name, setName] = useState(user.name);
    const [relationship, setRelationship] = useState<UserProfile['relationship']>(user.relationship);
    const [avatar, setAvatar] = useState(user.avatar || '👤');

    const avatarOptions = ['👤', '👩', '👨', '👵', '👴', '👧', '👦', '🧒', '👶', '🐶', '🐱', '🐦', '🐟'];

    // Check if avatar is a URL (Google photo)
    const isImageAvatar = user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/'));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        updateUser(user.id, {
            name: name.trim(),
            relationship,
            avatar: isImageAvatar ? user.avatar : avatar, // Keep Google photo if it was one
        });

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-user-modal" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    type="button"
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <h2 className="add-user-title">Edit Profile</h2>

                <form onSubmit={handleSubmit}>
                    {!isImageAvatar && (
                        <div className="form-group">
                            <label>Choose Avatar</label>
                            <div className="avatar-grid">
                                {avatarOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        className={`avatar-option ${avatar === opt ? 'selected' : ''}`}
                                        onClick={() => setAvatar(opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {isImageAvatar && (
                        <div className="form-group">
                            <label>Avatar</label>
                            <div className="edit-avatar-preview">
                                <img src={user.avatar} alt={user.name} className="edit-avatar-img" />
                                <span className="edit-avatar-note">Linked to Google account</span>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Mom, Dad, Michael"
                            className="user-input"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Relationship</label>
                        <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value as any)}
                            className="user-select"
                        >
                            <option value="self">Me</option>
                            <option value="parent">Parent</option>
                            <option value="spouse">Spouse</option>
                            <option value="child">Child</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={!name.trim()}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
