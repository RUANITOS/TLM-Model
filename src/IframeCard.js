import React, { useState } from 'react';
import './styles/IframeCard.css'; // Certifique-se de adicionar o estilo adequado

const IframeCard = ({ iframeSrc, closeCard }) => {
  return (
    <div className="iframe-card-overlay">
      <div className="iframe-card">
        <button className="close-btn" onClick={closeCard}>X</button>
        <iframe 
          src={iframeSrc} 
          title="Iframe Modal" 
          frameBorder="0"
          className="iframe-content"
        ></iframe>
      </div>
    </div>
  );
};

export default IframeCard;
