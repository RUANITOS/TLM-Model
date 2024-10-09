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
  
  function openModal() {
    // Cria o elemento div para o modal
    const modalDiv = document.createElement("div");
    modalDiv.id = "modal"; // Define um id para o modal
    modalDiv.style.position = "fixed";
    modalDiv.style.top = "10%";
    modalDiv.style.left = "57%";
    modalDiv.style.width = "40%";
    modalDiv.style.height = "40%";
    modalDiv.style.display = "flex";
    modalDiv.style.alignItems = "center";
    modalDiv.style.justifyContent = "center";
    modalDiv.style.zIndex = "10000"; // Z-index maior que o card
    modalDiv.style.backgroundColor = "#1a2a5d";
    modalDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modalDiv.style.padding = "20px";
    modalDiv.style.borderRadius = "10px";
    modalDiv.style.overflow = "hidden";

    // Cria um contêiner para manter a proporção 16:9
    const aspectRatioContainer = document.createElement("div");
    aspectRatioContainer.style.position = "relative";
    aspectRatioContainer.style.width = "100%";
    aspectRatioContainer.style.paddingBottom = "56.25%"; // 16:9 aspect ratio
    aspectRatioContainer.style.overflow = "hidden"; // Esconde qualquer conteúdo que ultrapasse o contêiner
    aspectRatioContainer.style.margin = "100px 0"; // Adiciona margem acima e abaixo do vídeo

    // Cria o iframe
    const iframeElement = document.createElement("iframe");
    iframeElement.src = "https://share.synthesia.io/embeds/videos/d1172a35-4c6f-43e2-aaf4-2898d9ba2490"; // URL do conteúdo do iframe
    iframeElement.style.position = "absolute"; // Posiciona o iframe dentro do contêiner
    iframeElement.style.top = "0";
    iframeElement.style.left = "0";
    iframeElement.style.width = "100%"; // Preenche a largura do contêiner
    iframeElement.style.height = "100%"; // Preenche a altura do contêiner
    iframeElement.style.border = "none"; // Remove a borda do iframe

    // Adiciona o iframe ao contêiner
    aspectRatioContainer.appendChild(iframeElement);

    // Cria o botão de fechar
    const closeButton = document.createElement("button");
    closeButton.innerText = "Fechar";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.padding = "10px 20px";
    closeButton.style.cursor = "pointer";
    closeButton.style.backgroundColor = "#404040";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    closeButton.style.borderRadius = "5px";

    // Adiciona um evento ao botão para fechar o modal
    closeButton.onclick = function () {
        document.body.removeChild(modalDiv); // Remove o modal do body
    };

    // Adiciona o contêiner de aspecto e o botão ao modal
    modalDiv.appendChild(aspectRatioContainer);
    modalDiv.appendChild(closeButton);

    // Adiciona o modal ao body
    document.body.appendChild(modalDiv);
}

// Adiciona evento ao botão para abrir o modal
document.getElementById("openModalButton").onclick = openModal;
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
        { id: 'square-K-5', iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png' },
        { id: 'square-K-10', iconSrc: process.env.PUBLIC_URL + '/assets/icon3.png' },
      ],
    },
    'square-V-7': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon4.png',
      hoverText: 'IoT',
      className: 'icon-about',
      linkedIcons: [
        { id: 'square-U-5', iconSrc: process.env.PUBLIC_URL + '/assets/icon4.png' },
        { id: 'square-U-10', iconSrc: process.env.PUBLIC_URL + '/assets/icon3.png' },
      ],
    },
    'square-P-2': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon2.png',
      hoverText: 'Modal 1',
      className: 'icon-about',
      linkedIcons: [],
    },
    'square-P-11': {
      parentIconSrc: process.env.PUBLIC_URL + '/assets/icon2.png',
      hoverText: 'Modal 2',
      className: 'icon-about',
      linkedIcons: [],
    },
  };
  const handleIconClick = (linkedIcons) => {
    const updatedLinkedIcons = { ...activeLinkedIcons };
    linkedIcons.forEach((icon) => {
      updatedLinkedIcons[icon.id] = icon;
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