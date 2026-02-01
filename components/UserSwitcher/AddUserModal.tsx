import React, { useState, useRef } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { validateImportData } from '../../services/dataService';
import { AppData, UserProfile } from '../../types';
import './UserSwitcher.css';

interface AddUserModalProps {
    onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose }) => {
    const { addUser } = useUserStore();
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState<UserProfile['relationship']>('other');
    const [avatar, setAvatar] = useState('👤');
    const [importedData, setImportedData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const avatarOptions = ['👤', '👩', '👨', '👵', '👴', '👧', '👦', '🧒', '👶', '🐶', '🐱', '🐦', '🐟'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        addUser(name, relationship, avatar);

        // If we have imported data, save it to the new user's storage
        if (importedData) {
            // Get the newly created user (last one added)
            const users = JSON.parse(localStorage.getItem('pillbow_users') || '[]');
            const newUser = users[users.length - 1];
            if (newUser) {
                const userData: AppData = {
                    medications: importedData.medications,
                    dayLogs: importedData.dayLogs,
                    settings: importedData.settings,
                    lastUpdated: new Date().toISOString(),
                };
                localStorage.setItem(`pillbow_data_${newUser.id}`, JSON.stringify(userData));
            }
        }

        onClose();
    };

    const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string);
                const validation = validateImportData(parsed);
                if (!validation.valid) {
                    alert(`Invalid file: ${validation.error}`);
                    return;
                }
                setImportedData(parsed);
                // Pre-fill name from metadata if available
                if (parsed.metadata?.userName) {
                    setName(parsed.metadata.userName);
                } else if (parsed.userProfile?.name) {
                    setName(parsed.userProfile.name);
                }
                // Pre-fill avatar from user profile if available
                if (parsed.userProfile?.avatar && !parsed.userProfile.avatar.startsWith('http')) {
                    setAvatar(parsed.userProfile.avatar);
                }
                // Pre-fill relationship if available
                if (parsed.userProfile?.relationship) {
                    setRelationship(parsed.userProfile.relationship);
                }
            } catch {
                alert("Invalid file. Make sure it's a valid PillBow backup.");
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.readAsText(file);
    };

    const clearImport = () => {
        setImportedData(null);
        setName('');
        setAvatar('👤');
        setRelationship('other');
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

                    {/* Import from File */}
                    <div className="form-group">
                        <label>Import Data from Backup</label>
                        {importedData ? (
                            <div className="import-file-status">
                                <span className="import-file-status__icon">✅</span>
                                <span className="import-file-status__text">
                                    {importedData.medications?.length || 0} medications loaded
                                </span>
                                <button
                                    type="button"
                                    className="import-file-status__clear"
                                    onClick={clearImport}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="import-file-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span>📂</span>
                                Import from File
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            style={{ display: 'none' }}
                            onChange={handleImportFile}
                        />
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
