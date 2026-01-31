import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { UserProfile } from '../../types';
import './UserSwitcher.css';

interface AddUserModalProps {
    onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose }) => {
    const { addUser } = useUserStore();
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState<UserProfile['relationship']>('other');
    const [avatar, setAvatar] = useState('👤');

    const avatarOptions = ['👤', '👩', '👨', '👵', '👴', '👧', '👦', '🧒', '👶', '🐶', '🐱', '🐦', '🐟'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        addUser(name, relationship, avatar);
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

                <h2 className="add-user-title">Add Family Member</h2>

                <form onSubmit={handleSubmit}>
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
                            Add Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
