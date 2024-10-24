import React, { useState } from 'react';
import './styles/Grid.css';

const mockData = [
  {
    id: 'icon-1',
    src: process.env.PUBLIC_URL + '/assets/caixa.png',
    placement: 'square-6-7',
    hovertext: 'Caixa de informações',
    associatedIcons: [
      {
        id: 'icon-1-1',
        src: process.env.PUBLIC_URL + '/assets/lixo.png',
        placement: 'square-4-9',
        hovertext: 'Lixeira',
        isMiddle: false,
        associatedIcons: [
          {
            id: 'icon-1-1-1',
            src: process.env.PUBLIC_URL + '/assets/linkExterno.png',
            placement: 'square-3-4',
            hovertext: 'Link Externo',
            isMiddle: false,
            associatedIcons: [],
          },
          {
            id: 'icon-1-1-2',
            src: process.env.PUBLIC_URL + '/assets/caixa.png',
            placement: 'square-8-9',
            hovertext: 'Caixa',
            associatedIcons: [],
          },
        ],
      },
      {
        id: 'icon-1-2',
        src: process.env.PUBLIC_URL + '/assets/sobre.png',
        placement: 'square-10-8',
        hovertext: 'Sobre nós',
        associatedIcons: [],
      },
    ],
  },
  {
    id: 'icon-2',
    src: process.env.PUBLIC_URL + '/assets/partilhar.png',
    placement: 'square-25-6',
    hovertext: 'Compartilhar',
    associatedIcons: [
      {
        id: 'icon-2-1',
        src: process.env.PUBLIC_URL + '/assets/mais.png',
        placement: 'square-7-2',
        hovertext: 'Mais opções',
        associatedIcons: [],
      },
    ],
  },
  {
    id: 'icon-3',
    src: process.env.PUBLIC_URL + '/assets/logonova.png',
    placement: 'square-14-7',
    hovertext: 'Logo',
    associatedIcons: [],
  },
  {
    id: 'icon-4',
    src: process.env.PUBLIC_URL + '/assets/documento.png',
    placement: 'square-7-11',
    hovertext: 'Documento',
    associatedIcons: [],
    isMiddle: false,
    modalTitle: "Informações sobre o Icone 4",
    modalContent: "Aqui estão algumas informações sobre o ícone 4."
  },
  {
    id: 'icon-5',
    src: process.env.PUBLIC_URL + '/assets/video.png',
    placement: 'square-13-3',
    hovertext: 'Vídeo',
    associatedIcons: [],
    isMiddle: false,
    modalTitle: "Atuação Nacional",
    modalContent: "Assista ao vídeo a seguir para obter mais informações."
  },
  {
    id: 'icon-6', // Novo ícone
    src: process.env.PUBLIC_URL + '/assets/informacoes.png',
    placement: 'square-5-13',
    hovertext: 'Informações adicionais',
    associatedIcons: [],
    isMiddle: false,
    alertContent: "Este é um alerta do ícone 6!" // Mensagem do alerta
  }
];


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

  const [openIcons, setOpenIcons] = useState({});
  const [centralIcon, setCentralIcon] = useState(null);
  const [displayIcons, setDisplayIcons] = useState(mockData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [hoverText, setHoverText] = useState(''); // Estado para armazenar o texto de hover
  const [hoverPosition, setHoverPosition] = useState(null); // Posição do hover

  const handleIconClick = (icon) => {
    if (icon.id === 'icon-4') {
      setModalContent(icon.modalContent);
      setModalTitle(icon.modalTitle);
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
      setModalTitle(icon.modalTitle);
      setIsModalOpen(true);
      return;
    }
    if (icon.id === 'icon-6') {
      alert(icon.alertContent);
      return;
    }

    if (icon.isMiddle === false) {
      return;
    }

    if (centralIcon === icon.id) {
      setCentralIcon(null);
      setDisplayIcons(mockData);
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
          src={icon.src}
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
