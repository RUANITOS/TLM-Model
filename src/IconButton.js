import React, { useState } from 'react';
import './styles/IconButton.css';

const IconButton = ({ parentIconSrc, hoverText, linkedIcons, href, className, onIconClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla o estado do modal
    
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
        
        // Condicional para o ícone que deve abrir um iframe em um modal
        if (hoverText === 'Modal 1') { // Verifica pelo texto de hover ou outro critério
            setIsModalOpen(true); // Abre o modal com iframe
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); // Função para fechar o modal
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

            {/* Hover text ao passar o mouse */}
            {isHovered && (
                <div className="hover-text">
                    {hoverText}
                </div>
            )}

            {/* Renderizar modal com iframe se o modal estiver aberto */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content">
                        <iframe
                            src="https://share.synthesia.io/embeds/videos/3a6d7751-1a3f-44c6-97ec-43ecfdd738e0" // Coloque a URL que deseja exibir
                            title="Iframe Example"
                            width="75%"
                            height="194px"
                            style={{ border: 'none', zIndex:'100000' }}
                        ></iframe>
                        <button className="close-button" onClick={closeModal}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconButton;
