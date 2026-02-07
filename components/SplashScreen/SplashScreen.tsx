import React, { useState, useEffect } from "react";
import "./SplashScreen.css";

interface SplashScreenProps {
  onDone: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDone }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2800);
    const doneTimer = setTimeout(onDone, 3400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`splash${fading ? " splash--fading" : ""}`}>
      {/* Pharmacy cross icon with floating pills */}
      <div className="splash__cross">
        <div className="splash__cross-bg">
          <div className="splash__cross-shape">
            <div className="splash__cross-h" />
            <div className="splash__cross-v" />
          </div>
        </div>
        <div className="splash__pill splash__pill--1" />
        <div className="splash__pill splash__pill--2" />
        <div className="splash__pill splash__pill--3" />
      </div>

      {/* App name */}
      <h1 className="splash__title">
        Pill<span className="splash__title-accent">Bow</span>
      </h1>
      <p className="splash__tagline">Your medication companion</p>

      {/* Progress bar */}
      <div className="splash__progress">
        <div className="splash__progress-bar" />
      </div>

      {/* Loading dots */}
      <div className="splash__dots">
        <div className="splash__dot" />
        <div className="splash__dot" />
        <div className="splash__dot" />
      </div>
    </div>
  );
};
