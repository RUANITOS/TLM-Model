import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Grid.css';

const Grid = () => {
  const rows = 15;
  const cols = 30;

  const [displayIcons, setDisplayIcons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const [isPositionSelectorActive, setIsPositionSelectorActive] = useState(false);
  const [hoveredPosition, setHoveredPosition] = useState(null);

  const navigate = useNavigate();

  const fetchIconsAndMosaics = async () => {
    try {
      const iconsResponse = await fetch('http://localhost:5000/api/icons');
      const iconsData = await iconsResponse.json();
      const mosaicsResponse = await fetch('http://localhost:5000/api/mosaics');
      const mosaicsData = await mosaicsResponse.json();

      const combinedData = mosaicsData.map((mosaic) => {
        const associatedIcon = iconsData.find(icon => icon.icon_id === mosaic.id_icone);
        if (associatedIcon) {
          const imgBlob = associatedIcon.src ? new Blob([new Uint8Array(associatedIcon.src.data)]) : null;
          const imgUrl = imgBlob ? URL.createObjectURL(imgBlob) : '';
          return { ...mosaic, src: imgUrl };
        }
        return null;
      }).filter(icon => icon !== null);

      setDisplayIcons(combinedData);
    } catch (error) {
      console.error('Erro ao buscar ícones e mosaicos:', error);
    }
  };

  useEffect(() => {
    fetchIconsAndMosaics();
  }, []);

  const handleIconClick = (origemConteudo) => {
    setIframeSrc(origemConteudo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIframeSrc('');
  };

  const togglePositionSelector = () => {
    setIsPositionSelectorActive(!isPositionSelectorActive);
    setHoveredPosition(null);
  };

  const handleMouseOver = (row, col) => {
    if (isPositionSelectorActive) {
      setHoveredPosition({ row, col });
    }
  };

  const copyPositionToCookiesAndNavigate = (row, col) => {
    document.cookie = `position_row=${row}; path=/; max-age=${60 * 60 * 24 * 7}`;
    document.cookie = `position_col=${col}; path=/; max-age=${60 * 60 * 24 * 7}`;

    const positionText = `Linha ${row}, Coluna ${col}`;
    navigator.clipboard.writeText(positionText).then(() => {
      console.log('Texto copiado para a área de transferência!');
      navigate('/TLM-Producao/MosaicEditor'); // Redireciona para o MosaicEditor
    }).catch((err) => {
      console.error('Erro ao copiar o texto:', err);
    });
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
        <div
          key={id}
          id={id}
          className="square"
          onMouseOver={() => handleMouseOver(row + 1, col + 1)}
          onClick={() => {
            if (hoveredPosition) {
              copyPositionToCookiesAndNavigate(hoveredPosition.row, hoveredPosition.col);
            }
          }}
        >
          {iconInSquare ? renderIcon(iconInSquare) : null}
        </div>
      );
    })
  ).flat();

  return (
    <div className="grid-container">
      <div className="button-container">
        <button onClick={togglePositionSelector}>
          {isPositionSelectorActive ? 'Desativar Seleção de Posição' : 'Selecionar Posição'}
        </button>
        {hoveredPosition && (
          <div className="position-indicator">
            Posição: Linha {hoveredPosition.row}, Coluna {hoveredPosition.col}
          </div>
        )}
        <Link to="/TLM-Producao/MosaicEditor">
          <button className="icon-editor-button">Editar Mosaico</button>
        </Link>
      </div>
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
