import React, { useState } from 'react';
import './styles/IconButton.css';
const IconButton = ({ parentIconSrc, hoverText, linkedIcons, href, className,onIconClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const handleClick = () => {
        if (onIconClick) {
          onIconClick(linkedIcons); // Chama a função onClick passando os ícones vinculados
        }
      };

    return (
        <div className="icon-container">
            <a
                className="icon-button"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                href={href} // Usando o href aqui
                onClick={handleClick}
                rel="noopener noreferrer" // Para segurança
            >
                <img src={parentIconSrc} alt="Icon" className={`icon-image ${className}`} />
            </a>
            {isHovered && (
                <div className="hover-text">
                    {hoverText}
                </div>
            )}
            
        </div>
    );
};

export default IconButton;