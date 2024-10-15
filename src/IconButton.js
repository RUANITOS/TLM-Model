import React, { useState } from 'react';
import './styles/IconButton.css';

const IconButton = ({ parentId, parentIconSrc, hoverText, linkedIcons, href, className, onIconClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMouseToggle = (isHovered) => setIsHovered(isHovered);

    const handleClick = () => {
        onIconClick(parentId, linkedIcons);
        if (hoverText === 'Opções de Operação') {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="icon-container">
            <a
                className="icon-button"
                onMouseEnter={() => handleMouseToggle(true)}
                onMouseLeave={() => handleMouseToggle(false)}
                href={href}
                onClick={handleClick}
                rel="noopener noreferrer"
            >
                <img src={parentIconSrc} alt="Icon" className={`icon-image ${className}`} />
            </a>

            {isHovered && <div className="hover-text">{hoverText}</div>}

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content">
                        <iframe
                            src="https://share.synthesia.io/embeds/videos/3a6d7751-1a3f-44c6-97ec-43ecfdd738e0" // Coloque a URL que deseja exibir
                            title="Iframe Example"
                            width="85%"
                            height="170px"
                            style={{ border: 'none', zIndex: '100000' }}
                        />
                        <button className="close-button" onClick={closeModal}>X</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconButton;
