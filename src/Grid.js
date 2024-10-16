import React, { useState } from 'react';
import './styles/Grid.css';
import IconButton from './IconButton';

const Grid = () => {
  const rows = 15;
  const cols = 30;

  const defaultSquareL7Data = {
    parentIconSrc: process.env.PUBLIC_URL + '/assets/logonova.png',
    hoverText: 'Site legado',
    href: '',
    className: 'icon-legacy',
    linkedIcons: [],
  };

  const iconData = {
    'square-L-7': defaultSquareL7Data,
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

  const [cardContent, setCardContent] = useState(null);
  const [showIframe, setShowIframe] = useState(null);
  const [activeIcons, setActiveIcons] = useState(Object.keys(iconData));
  const [dynamicSquareL7Data, setDynamicSquareL7Data] = useState(null);
  const [clickedIcon, setClickedIcon] = useState(null); // Novo estado para rastrear o ícone clicado

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

    // Se clicou no square-L-7 e já tem dados dinâmicos, retorna ao padrão
    if (isLegacySite && dynamicSquareL7Data) {
      setDynamicSquareL7Data(null); // Retorna para o conteúdo padrão
      setActiveIcons(Object.keys(iconData)); // Ativa todos os ícones
      setClickedIcon(null); // Reseta o ícone clicado
    } else {
      // Atualiza o conteúdo do square-L-7 com as informações do ícone clicado
      if (!isLegacySite) {
        setDynamicSquareL7Data({
          parentIconSrc: iconData[parentId].parentIconSrc,
          hoverText: iconData[parentId].hoverText,
          href: iconData[parentId].href,
          className: iconData[parentId].className,
          linkedIcons: iconData[parentId].linkedIcons,
        });

        // Atualiza quais ícones devem estar ativos
        setActiveIcons(linkedIcons.map(icon => icon.id).concat('square-L-7'));
        setClickedIcon(parentId); // Armazena o ícone que foi clicado
      }
    }
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
      let iconToRender;

      if (id === 'square-L-7') {
        // Renderiza o conteúdo dinâmico ou padrão para square-L-7
        iconToRender = dynamicSquareL7Data || defaultSquareL7Data;
      } else {
        iconToRender = iconData[id] || {}; // Usa um objeto vazio se não houver dados
      }

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

          {/* Renderiza os linkedIcons se existirem e se o ícone correspondente foi clicado */}
          {clickedIcon === id && iconToRender.linkedIcons.length > 0 && (
            <div className="linked-icons">
              {iconToRender.linkedIcons.map((icon) => (
                <img
                  key={icon.id}
                  src={icon.iconSrc}
                  alt={`Linked Icon ${icon.id}`}
                  className="mini-icon-image"
                  onClick={icon.onClick} // Se houver um onClick definido
                />
              ))}
            </div>
          )}
        </div>
      );
    })
  ).flat();

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
