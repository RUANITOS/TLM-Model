import React, { useState } from 'react';
import './styles/Grid.css';
import IconButton from './IconButton'; // Importando o componente IconButton


const Grid = () => {
  const rows = 15;
  const cols = 30;
  const squares = [];

  const [activeLinkedIcons, setActiveLinkedIcons] = useState({});
  const [cardContent, setCardContent] = useState(null); // Estado para o card flutuante
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
      parentIconSrc: process.env.PUBLIC_URL + '/assets/logonova.png',
      hoverText: 'Site legado',
      href: 'https://www.tlm.net.br/',
      className: 'icon-legacy',
      linkedIcons: [
        //{ id: 'square-N-4', iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png' },
      ],
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
        { id: 'square-V-5', iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png',
          onClick: () => alert('Outro icone "IoT"')
         },
        
        {
          id: 'square-V-9',
          iconSrc: process.env.PUBLIC_URL + '/assets/icon3.png',
          onClick: () => setCardContent(`O Mosaico TLM Manager é uma ferramenta de software que introduz uma nova forma de visualização de navegação, ou estruturação de websites, e ainda de conteúdos que necessitem ser organizados, e acessados de forma intuitiva, como por exemplo as opções de funcionalidades de aplicações.
          
          É uma verdadeira plataforma visualização e desenvolvimento, permitindo como exemplo a formatação de um website, de modo totalmente parametrizado, particularizado, e ao mesmo tempo, com alto grau de automatismo, implicando em grande velocidade na sua implementação, bem como a organização de dados de qualquer natureza, com a mesma característica de visualização.
          
          Ao mesmo tempo, tem integrada uma ferramenta de geração de conteúdo, em especial de vídeos, criados à partir de textos descritivos, que lançam mão de recursos de inteligência artificial, que materializados através de avatares, traz muita vivacidade para a apresentação desejada, envolvendo custos mínimos de produção e com muita rapidez e objetividade.
          
          A TLM Technologies, através do Mosaico TLM Manager, cria não só uma estrutura flexível de acesso através de um uso muito dinâmico, como todo suporte para a geração e integração dos vídeos e estruturação para apresentação. Oferece ainda a necessária armazenamento e atualização de todo o conteúdo, com plena segurança global.
          
          Se o usuário já possui seu website tradicional, haverá “paralelismo” entre eles, de modo a não inviabilizar tal recurso ora em uso. Ou seja: coexistindo, agrega potencial.
          
          A infraestrutura de tecnologia e divulgação na Internet, é igualmente provida pela TLM, facilitando ainda mais a disponibilidade da solução toda.
          
          A seguir são apresentados dois exemplos, O primeiro, baseado no website convencional da TLM, para em seguida a nova estrutura, onde ficam evidentes a simplicidade de uso e objetividade na exposição e visualização do conteúdo.`), // Adicionando o onClick no subícone
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

  const closeCard = () => setCardContent(null); // Função para fechar o card

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
              id={`Linked Icon ${id}`}
              onClick={() => {
                // Verifica se o ícone ativo tem uma função onClick
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