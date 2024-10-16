import React, { useState } from 'react';
import './styles/Grid.css';

const mockData = [
  {
    id: 'icon-1',
    src: process.env.PUBLIC_URL + '/assets/caixa.png',
    placement: 'square-F-7',
    associatedIcons: [
      {
        id: 'icon-1-1',
        src: process.env.PUBLIC_URL + '/assets/lixo.png',
        placement: 'square-D-9',
        isMiddle: false,
        associatedIcons: [
          {
            id: 'icon-1-1-1',
            src: process.env.PUBLIC_URL + '/assets/linkExterno.png',
            placement: 'square-C-4',
            isMiddle: false,
            associatedIcons: [],
          },
          {
            id: 'icon-1-1-2',
            src: process.env.PUBLIC_URL + '/assets/caixa.png',
            placement: 'square-H-9',
            associatedIcons: [],
          },
        ],
      },
      {
        id: 'icon-1-2',
        src: process.env.PUBLIC_URL + '/assets/sobre.png',
        placement: 'square-J-8',
        associatedIcons: [],
      },
    ],
  },
  {
    id: 'icon-2',
    src: process.env.PUBLIC_URL + '/assets/partilhar.png',
    placement: 'square-T-6',
    associatedIcons: [
      {
        id: 'icon-2-1',
        src: process.env.PUBLIC_URL + '/assets/mais.png',
        placement: 'square-G-2',
        associatedIcons: [],
      },
    ],
  },
  {
    id: 'icon-3',
    src: process.env.PUBLIC_URL + '/assets/logonova.png',
    placement: 'square-N-7',
    associatedIcons: [],
  },
  {
    id: 'icon-4',
    src: process.env.PUBLIC_URL + '/assets/documento.png',
    placement: 'square-G-11',
    associatedIcons: [],
    isMiddle: false,
    modalTitle: "Informações sobre o Icone 4",
    modalContent: "Aqui estão algumas informações sobre o ícone 4."
  },
  {
    id: 'icon-5',
    src: process.env.PUBLIC_URL + '/assets/video.png',
    placement: 'square-N-3',
    associatedIcons: [],
    isMiddle: false,
    modalTitle: "Atuação Nacional",
    modalContent: "Assista ao vídeo a seguir para obter mais informações."
  },
  {
    id: 'icon-6', // Novo ícone
    src: process.env.PUBLIC_URL + '/assets/informacoes.png',
    placement: 'square-N-13',
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
  const centerSquare = 'square-L-7';

  const [openIcons, setOpenIcons] = useState({});
  const [centralIcon, setCentralIcon] = useState(null);
  const [displayIcons, setDisplayIcons] = useState(mockData);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal
  const [modalContent, setModalContent] = useState(''); // Conteúdo do modal
  const [modalTitle, setModalTitle] = useState(''); // Para armazenar o título do modal

  const getLetter = (num) => {
    let letter = '';
    while (num >= 0) {
      letter = String.fromCharCode((num % 26) + 65) + letter;
      num = Math.floor(num / 26) - 1;
    }
    return letter;
  };

  const handleIconClick = (icon) => {
    if (icon.id === 'icon-4') {
      // Abre o modal ao clicar no icon-4
      setModalContent(icon.modalContent); // Usa o conteúdo do ícone
      setModalTitle(icon.modalTitle); // Usa o título do ícone
      setIsModalOpen(true);
      return;
    }
  
    if (icon.id === 'icon-5') {
      // Abre o modal com o iframe ao clicar no icon-5
      setModalContent(
        <iframe 
          width="560" 
          height="315" 
          src="https://share.synthesia.io/embeds/videos/3a6d7751-1a3f-44c6-97ec-43ecfdd738e0" 
          title="Vídeo" 
          allowFullScreen 
        />
      );
      setModalTitle(icon.modalTitle); // Usa o título do ícone
      setIsModalOpen(true);
      return;
    }
    if (icon.id === 'icon-6') {
      // Alerta ao clicar no icon-6
      alert(icon.alertContent); // Exibe o alerta
      return;
    }
  
    if (icon.isMiddle === false) {
      // Não faz nada se o ícone não pode ir para o meio
      return;
    }
  
    if (centralIcon === icon.id) {
      // Clica no centro para voltar ao estado inicial
      setCentralIcon(null);
      setDisplayIcons(mockData);
    } else {
      // Mostra o ícone clicado no centro e apenas seus filhos
      setCentralIcon(icon.id);
      setDisplayIcons([icon, ...icon.associatedIcons]);
    }
  };
  
  const renderIcon = (icon) => {
    const isSpecialIcon = icon.id === 'icon-3'; // Verifica se é o ícone específico
  
    return (
      <div key={icon.id} className={`icon-container ${isSpecialIcon ? 'special' : ''}`}>
        <img
          src={icon.src}
          alt={icon.id}
          className={`icon ${isSpecialIcon ? 'special-icon' : ''}`}
          onClick={() => handleIconClick(icon)}
        />
      </div>
    );
  };

  const mapIconsToPlacement = () => {
    const iconMap = {};
    
    // Renderiza os ícones associados na posição especificada
    displayIcons.forEach(icon => {
      const position = centralIcon === icon.id ? centerSquare : icon.placement;
      iconMap[position] = renderIcon(icon);
    });

    return iconMap;
  };

  const iconMap = mapIconsToPlacement();

  const squares = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const id = `square-${getLetter(col)}-${row + 1}`;
      return (
        <div key={id} id={id} className="square">
          {/* Renderiza o ícone correspondente ao placement se existir */}
          {iconMap[id] || null}
        </div>
      );
    })
  ).flat();

  return (
    <div className="grid-container">
      {squares}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle} // Passando o título do modal
        content={modalContent} 
      />
    </div>
  );
};

export default Grid;
