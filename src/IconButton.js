import React, { useState } from 'react';
import './IconButton.css';
const IconButton = ({ parentIconSrc, hoverText, linkedIcons, href, className, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className="icon-container">
            <a
                className="icon-button"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                href={href} // Usando o href aqui
                onClick={onClick}
                rel="noopener noreferrer" // Para segurança
            >
                <img src={parentIconSrc} alt="Icon" className={`icon-image ${className}`} />
            </a>
            {isHovered && (
                <div className="hover-text">
                    {hoverText}
                </div>
            )}
            {/* Renderizando os ícones adicionais apenas se existirem */}
            {isHovered && linkedIcons.length > 0 && linkedIcons.map((icon) => (
                <button key={icon.id} className="icon-button">
                    <img src={icon.iconSrc} alt="Icon" className="icon-image" />
                </button>
            ))}
        </div>
    );
};

export default IconButton;