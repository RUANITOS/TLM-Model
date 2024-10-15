import React, { useState } from 'react';
import './styles/Grid.css';
import IconButton from './IconButton';

const Grid = () => {
  const rows = 15;
  const cols = 30;
  const squares = [];

  const [activeLinkedIcons, setActiveLinkedIcons] = useState({});
  const [cardContent, setCardContent] = useState(null);
  const [showIframe, setShowIframe] = useState(null); // Estado para o iframe

  const getLetter = (num) => {
    let letter = '';
    while (num >= 0) {
      letter = String.fromCharCode((num % 26) + 65) + letter;
      num = Math.floor(num / 26) - 1;
    }
    return letter;
  };

  const iconData = {
    'square-L-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/logonova.png',
      hoverText: 'Site legado',
      href: 'https://www.tlm.net.br/',
      className: 'icon-legacy',
      linkedIcons: [],
    },
    'square-F-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon2.png',
      hoverText: 'Sobre Nós',
      className: 'icon-about',
      linkedIcons: [
        { id: 'square-I-5', iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png' },
        { id: 'square-I-9', iconSrc: process.env.PUBLIC_URL + '/assets/icon3.png' },
      ],
    },
    'square-V-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon4.png',
      hoverText: 'IoT',
      className: 'icon-about',
      linkedIcons: [
        { 
          id: 'square-V-5', 
          iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png',
          onClick: () => alert('Outro icone "IoT"'),
        },
        {
          id: 'square-V-9',
          iconSrc: process.env.PUBLIC_URL + '/assets/icon3.png',
          onClick: () => setCardContent(`...`), // Conteúdo do card
        },
      ],
    },
    'square-N-2': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon2.png',
      hoverText: 'Opções de Operação',
      className: 'icon-about',
      linkedIcons: [],
    },
    'square-N-13': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon2.png',
      hoverText: 'Modal 2',
      className: 'icon-about',
      linkedIcons: [],
      onClick: () => openIframe('https://www.tlm.net.br/'), // Corrigido para onClick
    },
  };

  const handleIconClick = (linkedIcons) => {
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

      squares.push(
        <div key={id} id={id} className="square">
          {iconData[id] && (
            <IconButton
              parentId={id}
              parentIconSrc={iconData[id].parentIconSrc}
              hoverText={iconData[id].hoverText}
              linkedIcons={iconData[id].linkedIcons}
              href={iconData[id].href}
              className={iconData[id].className}
              onIconClick={() => {
                handleIconClick(iconData[id].linkedIcons);
                if (iconData[id].href) openIframe(iconData[id].href); // Passando a função para abrir o iframe
              }}
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