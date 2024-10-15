import React, { useState } from 'react';
import './styles/Grid.css';
import IconButton from './IconButton';

const Grid = () => {
  const rows = 15;
  const cols = 30;
  const squares = [];
  const iconData = {
    'square-L-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/logonova.png',
      hoverText: 'Site legado',
      href: 'https://www.tlm.net.br/',
      className: 'icon-legacy',
      linkedIcons: [],
    },
    'square-F-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/pasta.png',
      hoverText: 'Sobre Nós',
      className: 'icon-about',
      linkedIcons: [
        { id: 'square-I-5', iconSrc: process.env.PUBLIC_URL + '/assets/mais.png' },
        { id: 'square-I-9', iconSrc: process.env.PUBLIC_URL + '/assets/sobre.png' },
      ],
    },
    'square-V-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/partilhar.png',
      hoverText: 'IoT',
      className: 'icon-about',
      linkedIcons: [
        { 
          id: 'square-V-5', 
          iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png',
          onClick: () => alert('Outro ícone "IoT"'),
        },
        {
          id: 'square-V-9',
          iconSrc: process.env.PUBLIC_URL + '/assets/icon3.png',
          onClick: () => setCardContent(`...`), // Conteúdo do card
        },
      ],
    },
    'square-N-2': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/video.png',
      hoverText: 'Opções de Operação',
      className: 'icon-about',
      linkedIcons: [],
    },
    'square-N-13': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/sobre.png',
      hoverText: 'Modal 2',
      className: 'icon-about',
      linkedIcons: [],
      onClick: () => openIframe('https://www.tlm.net.br/'), // Corrigido para onClick
    },
  };

  const [activeLinkedIcons, setActiveLinkedIcons] = useState({});
  const [cardContent, setCardContent] = useState(null);
  const [showIframe, setShowIframe] = useState(null);
  const [centralIcon, setCentralIcon] = useState('square-L-7'); // Estado para o ícone central (começa com "site legado")
  const [activeIcons, setActiveIcons] = useState(Object.keys(iconData)); // Inicia com todos os ícones visíveis

  const getLetter = (num) => {
    let letter = '';
    while (num >= 0) {
      letter = String.fromCharCode((num % 26) + 65) + letter;
      num = Math.floor(num / 26) - 1;
    }
    return letter;
  };

  const handleIconClick = (parentId, linkedIcons) => {
    if (parentId !== 'square-L-7') {
      // Se o ícone "mãe" não for o "site legado"
      if (centralIcon === 'square-L-7') {
        // Mova o ícone "mãe" para o centro
        setCentralIcon(parentId);
        // Exiba apenas o ícone "mãe" e seus ícones vinculados
        const iconsToShow = linkedIcons.map(icon => icon.id).concat(parentId);
        setActiveIcons(iconsToShow); // Atualiza a lista de ícones visíveis
      } else if (centralIcon === parentId) {
        // Retorna o ícone central para o "site legado" e exibe todos os ícones
        setCentralIcon('square-L-7');
        setActiveIcons(Object.keys(iconData)); // Mostra todos os ícones novamente
      }
    }

    const updatedLinkedIcons = { ...activeLinkedIcons };

    linkedIcons.forEach((icon) => {
      if (updatedLinkedIcons[icon.id]) {
        delete updatedLinkedIcons[icon.id];
      } else {
        updatedLinkedIcons[icon.id] = icon;
      }
    });

    setActiveLinkedIcons(updatedLinkedIcons);
  };

  const closeCard = () => {
    setCardContent(null);
    setShowIframe(null); // Fechar o iframe ao fechar o card
  };

  const openIframe = (url) => {
    setCardContent(null); // Limpa o conteúdo do card
    setShowIframe(url); // Abre o iframe com a URL
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xLabel = getLetter(col);
      const yLabel = row + 1;
      const id = `square-${xLabel}-${yLabel}`;

      let iconToRender = iconData[id];

      // Se o ícone central não for o "site legado", renderize o ícone central
      if (centralIcon === id) {
        iconToRender = iconData[centralIcon]; // Exibir o ícone "mãe"
      }

      // Renderizar todos os quadrados, mas só exibir os ícones ativos
      squares.push(
        <div key={id} id={id} className="square">
          {iconToRender && activeIcons.includes(id) && (
            <IconButton
              parentId={id}
              parentIconSrc={iconToRender.parentIconSrc}
              hoverText={iconToRender.hoverText}
              linkedIcons={iconToRender.linkedIcons}
              href={iconToRender.href}
              className={iconToRender.className}
              onIconClick={() => handleIconClick(id, iconToRender.linkedIcons)} // Passa o ID e ícones vinculados
            />
          )}
          {activeLinkedIcons[id] && (
            <img
              src={activeLinkedIcons[id].iconSrc}
              alt={`Linked Icon ${id}`}
              className="mini-icon-image"
              id={`Linked Icon ${id}`}
              onClick={() => {
                if (activeLinkedIcons[id].onClick) {
                  activeLinkedIcons[id].onClick();
                }
              }}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className="grid-container">
      {squares}
      {showIframe && (
        <div className="iframe-overlay">
          <iframe
            src={showIframe}
            title="Iframe Example"
            className="iframe-content"
            style={{ width: '100%', height: '100%' }} // Ajustar tamanho do iframe
          />
          <button onClick={closeCard} className="close-button">X</button>
        </div>
      )}
      {cardContent && (
        <div className="card-overlay">
          <div className="card-content">
            <button onClick={closeCard} className="close-button">X</button>
            <p>{cardContent}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grid;
