import React, { useState, useEffect } from 'react';
import './styles/Grid.css';

const Modal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{content}</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

const Grid = () => {
  const rows = 15;
  const cols = 30;
  const centerSquare = 'square-12-7'; // Exemplo de ícone central ajustado

  const [centralIcon, setCentralIcon] = useState(null);
  const [displayIcons, setDisplayIcons] = useState([]); // Inicializa como um array vazio
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [hoverText, setHoverText] = useState(''); // Estado para armazenar o texto de hover
  const [hoverPosition, setHoverPosition] = useState(null); // Posição do hover

  const fetchIcons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/icons');
      const data = await response.json();
  
      const iconsWithAssociated = await Promise.all(data.map(async (icon) => {
        const imgBlob = icon.src ? new Blob([new Uint8Array(icon.src.data)]) : null; // Converte o buffer do BLOB
        const imgUrl = imgBlob ? URL.createObjectURL(imgBlob) : ''; // Cria a URL a partir do BLOB
  
        return {
          ...icon,
          id: icon.icon_id, // Altera o ID para usar o icon_id do banco
          associatedIcons: typeof icon.associated_icons === 'string' ? JSON.parse(icon.associated_icons) : icon.associated_icons,
          src: imgUrl, // Usa a URL gerada
        };
      }));
  
      setDisplayIcons(iconsWithAssociated); // Atualiza o estado com os ícones convertidos
    } catch (error) {
      console.error('Erro ao buscar ícones:', error);
    }
  };
  
  

  useEffect(() => {
    fetchIcons(); // Chama a função ao montar o componente
  }, []); 

  const handleIconClick = (icon) => {
    console.log(`Ícone clicado: ${icon.id}`);
    if (icon.id === 'icon-4') {

      setModalContent(icon.modal_content);
      setModalTitle(icon.modal_title);
      setIsModalOpen(true);
      return;
    }

    if (icon.id === 'icon-5') {
      setModalContent(
        <iframe 
          width="560" 
          height="315" 
          src="https://share.synthesia.io/embeds/videos/3a6d7751-1a3f-44c6-97ec-43ecfdd738e0" 
          title="Vídeo" 
          allowFullScreen 
        />
      );
      setModalTitle(icon.modal_title);
      setIsModalOpen(true);
      return;
    }
    if (icon.id === 'icon-6') {
      console.log("icone 6 clicado")
      alert(icon.alertContent);
      return;
    }

    if (icon.isMiddle === false) {
      return;
    }

    if (centralIcon === icon.id) {
      setCentralIcon(null);
      fetchIcons(); // Recarrega todos os ícones
    } else {
      setCentralIcon(icon.id);
      setDisplayIcons([icon, ...icon.associatedIcons]);
    }
  };
  const renderIcon = (icon) => {
    const isSpecialIcon = icon.id === 'icon-3';
  
    return (
      <div
        key={icon.id}
        className={`icon-container ${isSpecialIcon ? 'special' : ''}`}
        onMouseEnter={() => {
          setHoverText(icon.hovertext); // Define o texto de hover
          setHoverPosition(icon.placement); // Define a posição para exibir o hover
        }}
        onMouseLeave={() => {
          setHoverText(''); // Limpa o texto de hover
          setHoverPosition(null); // Limpa a posição
        }}
      >
        <img
          src={icon.src} // Aqui é onde a URL gerada a partir do BLOB é usada
          alt={icon.id}
          className={`icon ${isSpecialIcon ? 'special-icon' : ''}`}
          onClick={() => handleIconClick(icon)}
        />
        <div className="hover-text">
          {icon.hovertext}
        </div>
      </div>
    );
  };

  const mapIconsToPlacement = () => {
    const iconMap = {};
    
    displayIcons.forEach(icon => {
      const position = centralIcon === icon.id ? centerSquare : icon.placement;
      iconMap[position] = renderIcon(icon);
    });

    return iconMap;
  };

  const iconMap = mapIconsToPlacement();

  const squares = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const id = `square-${col + 1}-${row + 1}`; // Alterado para usar apenas números
      return (
        <div key={id} id={id} className="square">
          {iconMap[id] || null}
        </div>
      );
    })
  ).flat();

  return (
    <div className="grid-container">
      {squares}
      {hoverText && hoverPosition && (
        <div className="hover-text" style={{ position: 'absolute', top: `calc(${hoverPosition}%)`, left: `calc(${hoverPosition}%)` }}>
          {hoverText}
        </div>
      )}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle}
        content={modalContent} 
      />
    </div>
  );
};

export default Grid;
