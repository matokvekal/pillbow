import React from "react";
import "./PillGraphic.css";

interface PillGraphicProps {
  color: string;
  size?: "sm" | "md";
  count?: string;
  strength?: string;
}

export const PillGraphic: React.FC<PillGraphicProps> = ({
  color,
  size = "md",
  count,
  strength,
}) => {
  const pillSizeClass =
    size === "sm" ? "pill-graphic__pill--sm" : "pill-graphic__pill--md";

  return (
    <div className="pill-graphic">
      <div className="pill-graphic__label-container">
        {strength && <span className="pill-graphic__strength">{strength}</span>}
        {count && <span className="pill-graphic__count">{count}</span>}
      </div>
      <div className={`pill-graphic__pill ${pillSizeClass} ${color}`}>
        <div className="pill-graphic__line" />
      </div>
    </div>
  );
};
