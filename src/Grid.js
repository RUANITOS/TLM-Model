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
        src: process.env.PUBLIC_URL + '/assets/caixa.png',
        placement: 'square-D-9',
        associatedIcons: [
          {
            id: 'icon-1-1-1',
            src: process.env.PUBLIC_URL + '/assets/caixa.png',
            placement: 'square-C-1',
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
        src: 'path/to/icon1-2.png',
        placement: 'square-J-8',
        associatedIcons: [],
      },
    ],
  },
  {
    id: 'icon-2',
    src: process.env.PUBLIC_URL + '/assets/partilhar.png',
    placement: 'square-B-7',
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
];

const Grid = () => {
  const rows = 15;
  const cols = 30;
  const centerSquare = 'square-L-7';

  const [openIcons, setOpenIcons] = useState({});
  const [centralIcon, setCentralIcon] = useState(null);
  const [displayIcons, setDisplayIcons] = useState(mockData); 

  const getLetter = (num) => {
    let letter = '';
    while (num >= 0) {
      letter = String.fromCharCode((num % 26) + 65) + letter;
      num = Math.floor(num / 26) - 1;
    }
    return letter;
  };

  const handleIconClick = (icon) => {
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

  const renderIcon = (icon, position) => (
    <div key={icon.id} className="icon-container">
      <img
        src={icon.src}
        alt={icon.id}
        className="icon"
        onClick={() => handleIconClick(icon)}
      />
    </div>
  );

  const mapIconsToPlacement = () => {
    const iconMap = {};
    
    // Renderiza os ícones associados na posição especificada
    displayIcons.forEach(icon => {
      const position = centralIcon === icon.id ? centerSquare : icon.placement;
      iconMap[position] = renderIcon(icon, position);
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
    </div>
  );
};

export default Grid;
