import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlertas } from './contexts/AlertasContext'; // Importa o contexto de alertas

import './styles/Grid.css';

const Grid = () => {
  const rows = 15;
  const cols = 30;

  const [displayIcons, setDisplayIcons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const [isPositionSelectorActive, setIsPositionSelectorActive] = useState(false);
  const [isDataFetchActive, setIsDataFetchActive] = useState(false); // Novo estado para o botão "Pegar Dados"
  const [hoveredPosition, setHoveredPosition] = useState(null);
  const [selectedMosaicData, setSelectedMosaicData] = useState(null); // Armazena dados do mosaico selecionado

  const navigate = useNavigate();
  const { addAlert } = useAlertas();
  const fetchIconsAndMosaics = async () => {
    try {
      // Fetch dos mosaicos
      const mosaicsResponse = await fetch('http://localhost:5001/api/mosaics');
      const mosaicsData = await mosaicsResponse.json();

      // Para cada mosaico, buscamos o ícone correspondente
      const combinedData = await Promise.all(mosaicsData.map(async (mosaic) => {
        const iconResponse = await fetch(`http://localhost:5001/api/icons/${mosaic.id_icone}`);
        const iconData = await iconResponse.json();

        if (iconData.src && iconData.src.data) {
          // Converte o array de bytes (Buffer) para um Blob
          const imgBlob = new Blob([new Uint8Array(iconData.src.data)], { type: 'image/png' });
          const imgUrl = URL.createObjectURL(imgBlob); // Cria a URL do objeto para exibição
          
          // Retorna o mosaico com o ícone associado
          return { ...mosaic, src: imgUrl };
        }

        return null; // Caso o ícone não tenha sido encontrado
      }));

      // Filtra mosaicos que possuem ícones associados
      setDisplayIcons(combinedData.filter(item => item !== null));
    } catch (error) {
      console.error('Erro ao buscar ícones e mosaicos:', error);
    }
  };

  useEffect(() => {
    fetchIconsAndMosaics();
  }, []);
  const fetchMosaicByPosition = async (row, col) => {
    try {
      const response = await fetch(`http://localhost:5001/api/mosaics/position/${row}/${col}`);
      const data = await response.json();
      localStorage.setItem('mosaicData', JSON.stringify(data));
      setSelectedMosaicData(data); // Salva dados do mosaico selecionado para alteração posterior
      console.log('Dados do mosaico salvos na localStorage:', data);
      addAlert('Mosaico selecionado','success')
    } catch (error) {
      console.error('Erro ao buscar dados do mosaico por posição:', error);
      addAlert('Erro ao buscar dados do mosaico','error')
    }
  };

  const modifyMosaicPosition = async (id, newRow, newCol) => {
    try {
      const response = await fetch(`http://localhost:5001/api/mosaics/modify/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posicao_linha: newRow, posicao_coluna: newCol }), // Carrega newRow e newCol para o backend
      });
      if (response.ok) {
        addAlert('Posição do mosaico alterada!','success')
        console.log(`Mosaico atualizado para a nova posição: Linha ${newRow}, Coluna ${newCol}`);
      } else {
        console.error('Erro ao atualizar posição do mosaico');
      }
    } catch (error) {
      console.error('Erro ao enviar dados de atualização:', error);
    }
  };
  useEffect(() => {
    fetchIconsAndMosaics();

    const positionRow = getCookie('position_row');
    const positionCol = getCookie('position_col');

    if (positionRow && positionCol) {
      fetchMosaicByPosition(positionRow, positionCol);
    }
  }, []);

  const getCookie = (name) => {
    const value = document.cookie;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

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

  const toggleDataFetch = () => {
    setIsDataFetchActive(!isDataFetchActive);
    setHoveredPosition(null);
  };

  const handleMouseOver = (row, col) => {
    if (isPositionSelectorActive || isDataFetchActive) {
      setHoveredPosition({ row, col });
    }
  };
  const handlePositionSelect = (row, col) => {
    if (isDataFetchActive) {
      fetchMosaicByPosition(row, col);
      setIsDataFetchActive(false); // Desativa o modo "Pegar Dados" após a busca
    } else if (isPositionSelectorActive) {
      copyPositionToCookiesAndNavigate(row, col);
    } else if (selectedMosaicData) {
      // Modo de atualização de posição
      const updatedData = { ...selectedMosaicData, posicao_linha: row, posicao_coluna: col };
      localStorage.setItem('mosaicData', JSON.stringify(updatedData)); // Atualiza no localStorage
      updateMosaicInDatabase(updatedData); // Atualiza no banco de dados
      setSelectedMosaicData(null); // Limpa os dados do mosaico selecionado
    }
  };

  const copyPositionToCookiesAndNavigate = (row, col) => {
    document.cookie = `position_row=${row}; path=/; max-age=${60 * 60 * 24 * 7}`;
    document.cookie = `position_col=${col}; path=/; max-age=${60 * 60 * 24 * 7}`;

    const positionText = `Linha ${row}, Coluna ${col}`;
    navigator.clipboard.writeText(positionText).then(() => {
      console.log('Texto copiado para a área de transferência!');
      fetchMosaicByPosition(row, col); // Busca dados do mosaico com os valores atualizados
      navigate('/TLM-Producao/MosaicEditor'); // Redireciona para o MosaicEditor
    }).catch((err) => {
      console.error('Erro ao copiar o texto:', err);
    });
  };
  const updateMosaicInDatabase = async (mosaicData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/mosaics/modify-position/${mosaicData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posicao_linha: mosaicData.posicao_linha,
          posicao_coluna: mosaicData.posicao_coluna
        }),
      });
      if (response.ok) {
        addAlert('Posição do mosaico atualizada com sucesso no banco de dados!', 'success');
        console.log('Posição do mosaico atualizada no banco de dados:', mosaicData);
      } else {
        console.error('Erro ao atualizar posição do mosaico no banco de dados');
        addAlert('Erro ao atualizar posição do mosaico no banco de dados', 'error');
      }
    } catch (error) {
      console.error('Erro ao enviar atualização da posição do mosaico:', error);
      addAlert('Erro ao enviar atualização da posição do mosaico', 'error');
    }
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
          onClick={() => handlePositionSelect(row + 1, col + 1)} // Passa a posição diretamente
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
        <button onClick={toggleDataFetch}>
          {isDataFetchActive ? 'Desativar Pegar Dados' : 'Pegar Dados'}
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
