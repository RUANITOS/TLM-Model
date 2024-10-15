import React, { useState } from 'react';
import './styles/Grid.css';
import IconButton from './IconButton';

const Grid = () => {
  const rows = 15;
  const cols = 30;
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
        { id: 'square-V-5', iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png' },
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
  const [centralIcon, setCentralIcon] = useState('square-L-7');
  const [activeIcons, setActiveIcons] = useState(Object.keys(iconData));

  const getLetter = (num) => {
    let letter = '';
    while (num >= 0) {
      letter = String.fromCharCode((num % 26) + 65) + letter;
      num = Math.floor(num / 26) - 1;
    }
    return letter;
  };

  const handleIconClick = (parentId, linkedIcons) => {
    const isLegacySite = parentId === 'square-L-7';
    const isCentralIcon = centralIcon === parentId;

    setCentralIcon(isLegacySite || isCentralIcon ? 'square-L-7' : parentId);
    setActiveIcons(isLegacySite || isCentralIcon
      ? Object.keys(iconData)
      : linkedIcons.map(icon => icon.id).concat(parentId)
    );

    setActiveLinkedIcons(prev => {
      const updated = { ...prev };
      linkedIcons.forEach((icon) => {
        updated[icon.id] = updated[icon.id] ? undefined : icon;
      });
      return updated;
    });
  };

  const closeCard = () => {
    setCardContent(null);
    setShowIframe(null);
  };

  const openIframe = (url) => {
    setCardContent(null);
    setShowIframe(url);
  };

  const squares = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const id = `square-${getLetter(col)}-${row + 1}`;
      const iconToRender = centralIcon === id ? iconData[centralIcon] : iconData[id];

      return (
        <div key={id} id={id} className="square">
          {iconToRender && activeIcons.includes(id) && (
            <IconButton
              parentId={id}
              parentIconSrc={iconToRender.parentIconSrc}
              hoverText={iconToRender.hoverText}
              linkedIcons={iconToRender.linkedIcons}
              href={iconToRender.href}
              className={iconToRender.className}
              onIconClick={handleIconClick}
            />
          )}
          {activeLinkedIcons[id] && (
            <img
              src={activeLinkedIcons[id].iconSrc}
              alt={`Linked Icon ${id}`}
              className="mini-icon-image"
              onClick={activeLinkedIcons[id].onClick}
            />
          )}
        </div>
      );
    })
  ).flat(); // Flatten the nested arrays

  return (
    <div className="grid-container">
      {squares}
      {showIframe && (
        <div className="iframe-overlay">
          <iframe
            src={showIframe}
            title="Iframe Example"
            className="iframe-content"
            style={{ width: '100%', height: '100%' }}
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
