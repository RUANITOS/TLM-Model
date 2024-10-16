import React, { useState } from 'react';
import './styles/Grid.css';

const mockData = [
  {
    id: 'icon-1',
    src: process.env.PUBLIC_URL + '/assets/caixa.png',
    placement: 'square-F-7', // Posição na grade
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

  const [openIcons, setOpenIcons] = useState({}); // Estado para controle dos ícones abertos

  const getLetter = (num) => {
    let letter = '';
    while (num >= 0) {
      letter = String.fromCharCode((num % 26) + 65) + letter;
      num = Math.floor(num / 26) - 1;
    }
    return letter;
  };

  const toggleIcon = (id) => {
    setOpenIcons((prev) => ({
      ...prev,
      [id]: !prev[id], // Alterna o estado do ícone clicado
    }));
  };
  

  const renderIcon = (icon) => {
    const isSpecialIcon = icon.id === 'icon-3'; // Verifica se é o ícone específico
  
    return (
      <div key={icon.id} className="icon-container">
        <img 
          src={icon.src} 
          alt={icon.id} 
          className={`icon ${isSpecialIcon ? 'special-icon' : ''}`} // Adiciona a classe especial se for o 'icon-3'
          onClick={() => toggleIcon(icon.id)} 
        />
      </div>
    );
  };
  

  // Função para mapear todos os ícones com seus placements
  const mapIconsToPlacement = () => {
    const iconMap = {};
    
    const mapIcon = (icon) => {
      iconMap[icon.placement] = renderIcon(icon);
      
      // Mapear ícones associados se o ícone estiver aberto
      if (openIcons[icon.id]) {
        icon.associatedIcons.forEach(mapIcon);
      }
    };

    mockData.forEach(mapIcon);
    return iconMap;
  };

  // Cria um mapa dos ícones e suas posições na grade
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
