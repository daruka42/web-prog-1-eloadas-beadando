import React from "react";
import "./CompButton.css";

function CompButton({ keyValue, onClick, className = "" }) {
  return (
    <button
      className={`key-button ${className}`}
      onClick={() => onClick(keyValue)}
    >
      {keyValue}
    </button>
  );
}

export default CompButton;
