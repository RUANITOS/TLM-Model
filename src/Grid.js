import React, { useState } from 'react';
import './styles/Grid.css';
import IconButton from './IconButton'; // Importando o componente IconButton


const Grid = () => {
  const rows = 15;
  const cols = 30;
  const squares = [];

  const [activeLinkedIcons, setActiveLinkedIcons] = useState({});
  
  const getLetter = (num) => {
    let letter = '';
    while (num >= 0) {
      letter = String.fromCharCode((num % 26) + 65) + letter;
      num = Math.floor(num / 26) - 1;
    }
    return letter;
  };

   // IDs e URLs das imagens para os quadrados que terão ícones
   const iconData = {
    'square-L-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/logo-tlm.png',
      hoverText: 'Site legado',
      href: 'https://www.tlm.net.br/',
      className: 'icon-legacy',
      linkedIcons: [
        //{ id: 'square-N-4', iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png' },
      ],
    },
    'square-H-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon2.png',
      hoverText: 'Sobre Nós',
      className: 'icon-about',
      linkedIcons: [
        { id: 'square-E-5', iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png' },
        { id: 'square-F-8', iconSrc: process.env.PUBLIC_URL + '/assets/icon3.png' },
      ],
    },
    'square-V-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon4.png',
      hoverText: 'IoT',
      className: 'icon-about',
      linkedIcons: [
        { id: 'square-V-5', iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png' },
        { id: 'square-V-9', iconSrc: process.env.PUBLIC_URL + '/assets/icon3.png' },
      ],
    },
    'square-N-2': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon2.png',
      hoverText: 'Opções de Operação',
      className: 'icon-about',
      linkedIcons: [],
    },
    'square-N-11': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon2.png',
      hoverText: 'Modal 2',
      className: 'icon-about',
      linkedIcons: [],
    },
  };
  const handleIconClick = (linkedIcons) => {
    const updatedLinkedIcons = { ...activeLinkedIcons };
  
    linkedIcons.forEach((icon) => {
      // Se o ícone já estiver ativo, remova-o
      if (updatedLinkedIcons[icon.id]) {
        delete updatedLinkedIcons[icon.id];
      } else {
        // Se o ícone não estiver ativo, adicione-o
        updatedLinkedIcons[icon.id] = icon;
      }
    });
  
    setActiveLinkedIcons(updatedLinkedIcons);
  };
  


  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xLabel = getLetter(col);
      const yLabel = row + 1;
      const id = `square-${xLabel}-${yLabel}`;

      squares.push(
        <div key={id} id={id} className="square">
          
          {/* Verifica se o quadrado deve ter um ícone */}
          {iconData[id] && (
            <IconButton
              parentId={id}
              parentIconSrc={iconData[id].parentIconSrc}
              hoverText={iconData[id].hoverText} // Aqui está a propriedade hoverText
              linkedIcons={iconData[id].linkedIcons}
              href={iconData[id].href} // Passando href
              className={iconData[id].className} // Passando a classe específica
              onIconClick={handleIconClick} // Função de clique para exibir mini ícones
            />
          )}
          {activeLinkedIcons[id] && (
            <img
              src={activeLinkedIcons[id].iconSrc}
              alt={`Linked Icon ${id}`}
              className="mini-icon-image"
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className="grid-container">
      {squares}
    </div>
  );
};

export default Grid;