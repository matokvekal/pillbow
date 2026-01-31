import React from 'react';
import './UpdateBanner.css';

interface UpdateBannerProps {
  onUpdate: () => void;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({ onUpdate }) => {
  return (
    <div className="update-banner">
      <div className="update-banner-content">
        <div className="update-banner-icon">🔄</div>
        <div className="update-banner-text">
          <strong>New version available!</strong>
          <span>Update now to get the latest features</span>
        </div>
        <button className="update-banner-button" onClick={onUpdate}>
          Update Now
        </button>
      </div>
    </div>
  );
};
