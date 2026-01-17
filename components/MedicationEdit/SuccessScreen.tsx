import React, { useEffect } from "react";
import "./SuccessScreen.css";

interface SuccessScreenProps {
  message: string;
  onDone: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  message,
  onDone,
}) => {
  // Auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="success-screen">
      <div className="success-screen__content">
        {/* Success Icon */}
        <div className="success-screen__icon">
          <svg
            className="success-screen__checkmark"
            viewBox="0 0 52 52"
          >
            <circle
              className="success-screen__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="success-screen__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="success-screen__title">DONE!</h1>

        {/* Message */}
        <p className="success-screen__message">{message}</p>

        {/* OK Button */}
        <button
          className="success-screen__btn"
          onClick={onDone}
        >
          OK
        </button>

        {/* Auto close hint */}
        <p className="success-screen__hint">
          Closing automatically...
        </p>
      </div>
    </div>
  );
};
