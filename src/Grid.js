import React, { useState, useEffect } from 'react';
import './styles/Grid.css';

const Grid = () => {
  const rows = 15;
  const cols = 30;

  const [displayIcons, setDisplayIcons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');

  const fetchIconsAndMosaics = async () => {
    try {
      // Busca os ícones da rota /api/icons
      const iconsResponse = await fetch('http://localhost:5000/api/icons');
      const iconsData = await iconsResponse.json();

      // Busca os parâmetros de mosaico da rota /api/mosaics
      const mosaicsResponse = await fetch('http://localhost:5000/api/mosaics');
      const mosaicsData = await mosaicsResponse.json();

      // Combina os dados dos ícones com os parâmetros de mosaico
      const combinedData = mosaicsData.map((mosaic) => {
        const associatedIcon = iconsData.find(icon => icon.icon_id === mosaic.id_icone);

        if (associatedIcon) {
          const imgBlob = associatedIcon.src ? new Blob([new Uint8Array(associatedIcon.src.data)]) : null;
          const imgUrl = imgBlob ? URL.createObjectURL(imgBlob) : '';

          return {
            ...mosaic,
            src: imgUrl, // Adiciona a URL da imagem
          };
        }
        return null;
      }).filter(icon => icon !== null);

      setDisplayIcons(combinedData);
    } catch (error) {
      console.error('Erro ao buscar ícones e mosaicos:', error);
    }
  };

  useEffect(() => {
    fetchIconsAndMosaics(); // Chama a função ao montar o componente
  }, []);

  const handleIconClick = (origemConteudo) => {
    setIframeSrc(origemConteudo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIframeSrc('');
  };

  const renderIcon = (icon) => (
    <img
      src={icon.src}
      alt={icon.titulo_celula}
      className="icon"
      onClick={() => {
        if (icon.conteudo_efetivo === 0) {
          handleIconClick(icon.origem_conteudo);
        }
      }}
    />
  );

  const squares = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const id = `square-${col + 1}-${row + 1}`;
      const iconInSquare = displayIcons.find(icon => icon.posicao_linha === row + 1 && icon.posicao_coluna === col + 1);

      return (
        <div key={id} id={id} className="square">
          {iconInSquare ? renderIcon(iconInSquare) : null}
        </div>
      );
    })
  ).flat();

  return (
    <div className="grid-container">
      {squares}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={iframeSrc}
              title="Conteúdo Externo"
              className="iframe-content"
              frameBorder="0"
              allowFullScreen
            />
            <button className="close-button" onClick={closeModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grid;
