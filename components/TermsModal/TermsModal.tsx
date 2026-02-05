import React, { useState } from "react";
import "./TermsModal.css";

interface TermsModalProps {
    onClose: () => void;
    onAgree: () => void;
    isFirstLaunch?: boolean;
}

export const TermsModal: React.FC<TermsModalProps> = ({ onClose, onAgree, isFirstLaunch = false }) => {
    const [checked, setChecked] = useState(false);

    return (
        <div className="terms-modal-overlay">
            <div className="terms-modal">
                {/* Header */}
                <div className="terms-modal__header">
                    <h2 className="terms-modal__title">Terms & Conditions</h2>
                    {!isFirstLaunch && (
                        <button className="terms-modal__close" onClick={onClose} aria-label="Close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Scrollable Content */}
                <div className="terms-modal__content">
                    <div className="terms-modal__section">
                        <h3>1. Acceptance of Terms</h3>
                        <p>
                            By using PillBow, you agree to these Terms & Conditions. If you do not agree,
                            please do not use this application.
                        </p>
                    </div>

                    <div className="terms-modal__section">
                        <h3>2. Application Purpose</h3>
                        <p>
                            PillBow is a <strong>medication scheduler and reminder tool only</strong>. It is designed
                            to help you organize and track your medication schedule. This app does NOT:
                        </p>
                        <ul>
                            <li>Provide medical advice</li>
                            <li>Replace professional healthcare consultation</li>
                            <li>Diagnose or treat any medical conditions</li>
                            <li>Guarantee medication effectiveness or safety</li>
                        </ul>
                    </div>

                    <div className="terms-modal__section">
                        <h3>3. User Responsibility</h3>
                        <p>
                            You are <strong>solely responsible</strong> for:
                        </p>
                        <ul>
                            <li>Verifying all medication information entered into the app</li>
                            <li>Following your healthcare provider's instructions</li>
                            <li>Taking medications as prescribed by your doctor</li>
                            <li>Any actions taken based on the app's reminders or schedules</li>
                            <li>Consulting with healthcare professionals regarding your medications</li>
                        </ul>
                    </div>

                    <div className="terms-modal__section">
                        <h3>4. Limitation of Liability</h3>
                        <p>
                            The developer and all associated parties are <strong>NOT responsible or liable</strong> for:
                        </p>
                        <ul>
                            <li>Any missed medications or incorrect schedules</li>
                            <li>Any adverse health effects or medical complications</li>
                            <li>Data loss or technical failures</li>
                            <li>Any damages, losses, or injuries resulting from app use</li>
                            <li>Accuracy or completeness of information in the app</li>
                        </ul>
                        <p className="terms-modal__disclaimer">
                            <strong>USE THIS APP AT YOUR OWN RISK.</strong> Always consult with qualified
                            healthcare professionals regarding your medications.
                        </p>
                    </div>

                    <div className="terms-modal__section">
                        <h3>5. Prohibited Activities</h3>
                        <p>You may NOT:</p>
                        <ul>
                            <li>Download, copy, or redistribute the app without permission</li>
                            <li>Abuse, misuse, or exploit the app in any way</li>
                            <li>Use the app for any illegal purposes</li>
                            <li>Reverse engineer or attempt to extract source code</li>
                            <li>Remove or modify any copyright notices</li>
                        </ul>
                    </div>

                    <div className="terms-modal__section">
                        <h3>6. Changes to Terms</h3>
                        <p>
                            The developer reserves the right to <strong>modify these terms at any time</strong>
                            without prior notice. Continued use of the app after changes constitutes acceptance
                            of the modified terms.
                        </p>
                    </div>

                    <div className="terms-modal__section">
                        <h3>7. Privacy & Data</h3>
                        <p>
                            All medication data is stored locally on your device. The app does not transmit
                            your personal medical information to external servers. You are responsible for
                            backing up your data.
                        </p>
                    </div>

                    <div className="terms-modal__section">
                        <h3>8. No Warranty</h3>
                        <p>
                            This app is provided "AS IS" without warranties of any kind, either express or
                            implied, including but not limited to warranties of merchantability, fitness for
                            a particular purpose, or non-infringement.
                        </p>
                    </div>

                    <div className="terms-modal__footer-text">
                        <p>
                            <strong>By clicking "I Agree", you acknowledge that you have read, understood,
                                and agree to be bound by these Terms & Conditions.</strong>
                        </p>
                        <p className="terms-modal__version">
                            Last Updated: January 2026 | Version 0.0.1
                        </p>
                    </div>
                </div>

                {/* Checkbox for agreement */}
                <label className="terms-modal__checkbox-label">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        className="terms-modal__checkbox"
                    />
                    <span>I have read and agree to the Terms & Conditions</span>
                </label>

                {/* Footer Actions */}
                <div className="terms-modal__actions">
                    {!isFirstLaunch && (
                        <button className="terms-modal__btn terms-modal__btn--secondary" onClick={onClose}>
                            Cancel
                        </button>
                    )}
                    <button
                        className="terms-modal__btn terms-modal__btn--primary"
                        onClick={onAgree}
                        disabled={!checked}
                    >
                        I Agree
                    </button>
                </div>
            </div>
        </div>
    );
};
