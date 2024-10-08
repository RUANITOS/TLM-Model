import React from 'react';
import './styles/Grid.css';
import IconButton from './IconButton'; // Importando o componente IconButton


const Grid = () => {
  const rows = 15;
  const cols = 30;
  const squares = [];

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
    'square-M-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/logo-tlm.png',
      hoverText: 'Site legado',
      href: 'https://www.tlm.net.br/',
      className: 'icon-legacy',
      linkedIcons: [
        //{ id: 'square-A-2', iconSrc: 'https://example.com/icon2.png' },
      ],
    },
    'square-C-4': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon2.png',
      hoverText: 'Sobre Nós',
      className: 'icon-about',
      onClick: () => alert('Você clicou no ícone "Sobre Nós"!'),
      linkedIcons: [],
    },
    'square-W-12': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon3.png',
      hoverText: 'Opções de Operação',
      className: 'icon-about',
      onClick: () => alert('Você clicou no ícone "Opções de Operação"!'),
      linkedIcons: [
        //{ id: 'square-B-3', iconSrc: 'https://example.com/icon5.png' },
        //{ id: 'square-B-4', iconSrc: 'https://example.com/icon6.png' },
      ],
    },
  }
  ;

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
              onClick={iconData[id].onClick}  /* Passando a função onClick */
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