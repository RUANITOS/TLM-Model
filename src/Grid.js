import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlertas } from './contexts/AlertasContext'; // Importa o contexto de alertas

import './styles/Grid.css';

const Grid = () => {
  const rows = 15;
  const cols = 30;
  const [displayIcons, setDisplayIcons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idImplem, setIdImplem] = useState(null); // Novo estado para armazenar o id_implem
  const [iframeSrc, setIframeSrc] = useState('');
  const [isPositionSelectorActive, setIsPositionSelectorActive] = useState(false);
  const [isDataFetchActive, setIsDataFetchActive] = useState(false); // Novo estado para o botão "Pegar Dados"
  const [hoveredPosition, setHoveredPosition] = useState(null);
  const [selectedMosaicData, setSelectedMosaicData] = useState(null); // Armazena dados do mosaico selecionado
  const [hoveredIconData, setHoveredIconData] = useState(null); // Novo estado para armazenar os dados do ícone em hover
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [textModalContent, setTextModalContent] = useState('');
  const [textModalTitle, setTextModalTitle] = useState(''); // Adicionado para o título do modal
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Controle de visibilidade do menu
  const [reposicionando, setReposicionando] = useState(false);
  const [newPositionX, setNewPositionX] = useState(''); // Armazena a posição X
  const [newPositionY, setNewPositionY] = useState(''); // Armazena a posição Y

  const [isNewPositionActive, setIsNewPositionActive] = useState(false); // Controle de visibilidade das caixinhas
  const [xValue, setXValue] = useState(1); // Valor inicial para X
  const [yValue, setYValue] = useState(1); // Valor inicial para Y
  // dois novos estados para acompanhar o deslocamento da matriz:
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  //funções que alteram o deslocamento com base na entrada:
  const handleMatrixMovement = () => {
    setOffsetX(xValue - 1); // Ajuste baseado na posição inicial 1
    setOffsetY(yValue - 1);
  };
  const [confirmedPosition, setConfirmedPosition] = useState({ x: xValue, y: yValue });
  const handlePositionConfirmation = () => {
    setConfirmedPosition({ x: xValue, y: yValue });
    handleNewPosition();
    handleMatrixMovement();
  };
  const navigate = useNavigate();
  const { addAlert } = useAlertas();
  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible); // Alterna entre mostrar e esconder
  };
  const handleXChange = (e) => {
    const value = Math.max(1, Math.min(cols, Number(e.target.value))); // Limita entre 1 e 'cols'
    setXValue(value);
  };

  const handleYChange = (e) => {
    const value = Math.max(1, Math.min(rows, Number(e.target.value))); // Limita entre 1 e 'rows'
    setYValue(value);
  };
  const handleNewPosition = () => {
    if (newPositionX && newPositionY) {
      const row = parseInt(newPositionY, 10);
      const col = parseInt(newPositionX, 10);
      if (row > 0 && row <= rows && col > 0 && col <= cols) {
        handlePositionSelect(row, col);
      } else {
        addAlert('Posição inválida! Insira valores dentro do grid.', 'error');
      }
    }
  };
  const fetchIconsAndMosaics = async () => {
    try {
      // Obter mosaicos
      const mosaicsResponse = await fetch('https://link.tlm.net.br/api/mosaics', {
      });
      const mosaicsData = await mosaicsResponse.json();
      // Filtrar mosaicos pelo id_implem
      const filteredMosaics = mosaicsData.filter(mosaic => mosaic.id_implem === idImplem);
      // Obter ícones correspondentes
      const combinedData = await Promise.all(filteredMosaics.map(async (mosaic) => {
        const iconResponse = await fetch(`https://link.tlm.net.br/api/icons/${mosaic.id_icone}`, {
        });
        const iconData = await iconResponse.json();
        if (iconData.src && iconData.src.data) {
          const imgBlob = new Blob([new Uint8Array(iconData.src.data)], { type: 'image/png' });
          const imgUrl = URL.createObjectURL(imgBlob);
          return { ...mosaic, src: imgUrl };
        }
        return null;
      }));
      // Atualizar estado com mosaicos filtrados e ícones associados
      setDisplayIcons(combinedData.filter(item => item !== null));
    } catch (error) {
      console.error('Erro ao buscar ícones e mosaicos:', error);
    }
  };
  useEffect(() => {
    // Obter id_implem do cookie ou localStorage
    const storedIdImplem = getCookie('id_implem');
    console.log('Cookie id_implem:', storedIdImplem);
    setIdImplem(Number(storedIdImplem)); // Converter para número
    if (storedIdImplem) {
      fetchIconsAndMosaics();
      console.log('Cookie id_implem2:', storedIdImplem);
    }
  }, [idImplem]);
  useEffect(() => {
    //localStorage.clear();
    //clearCookies();
    fetchIconsAndMosaics();
  }, []);
  const clearCookies = () => {
    // Limpa cookies específicos
    document.cookie = 'mosaic_data=; path=/; max-age=0';
    document.cookie = 'position_row=; path=/; max-age=0';
    document.cookie = 'position_col=; path=/; max-age=0';
    // Se você quiser limpar todos os cookies
    const cookies = document.cookie.split(";");
    cookies.forEach(cookie => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; path=/; max-age=0`; // Expira o cookie
    });
  };
  const fetchMosaicByPosition = async (row, col) => {
    try {
      const response = await fetch(`https://link.tlm.net.br/api/mosaics/position/${row}/${col}`, {
      });
      const data = await response.json();
      // Salva todos os dados do mosaico selecionado na localStorage
      localStorage.setItem('mosaicData', JSON.stringify(data));
      // Salva dados do mosaico selecionado para alteração posterior
      setSelectedMosaicData(data);
      // Salvando todos os dados do mosaico nos cookies
      document.cookie = `mosaic_data=${JSON.stringify(data)}; path=/; max-age=${60 * 60 * 24 * 7}`; // Salva os dados completos do mosaico nos cookies
      const mosaicIdValue = data.id ? data.id : '';// Atribui vazio se não houver um valor válido
      document.cookie = `mosaic_id=${mosaicIdValue}; path=/; max-age=${60 * 60 * 24 * 7}`;
      console.log('Dados do mosaico salvos na localStorage:', data);
      addAlert('Mosaico selecionado', 'success')
    } catch (error) {
      console.error('Erro ao buscar dados do mosaico por posição:', error);
      addAlert('Erro ao buscar dados do mosaico', 'error')
    }
  };
  const modifyMosaicPosition = async (id, newRow, newCol) => {
    try {
      const response = await fetch(`https://link.tlm.net.br/api/mosaics/modify/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posicao_linha: newRow, posicao_coluna: newCol }), // Carrega newRow e newCol para o backend
      });
      if (response.ok) {
        addAlert('Posição do mosaico alterada!', 'success')
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
  }, []);
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  const handleIconClick = (origemConteudo, descricaoCompleta, conteudoEfetivo) => {
    console.log("Origem Conteúdo:", origemConteudo);
    console.log("Descrição Completa:", descricaoCompleta);
    console.log("Conteúdo Efetivo:", conteudoEfetivo);
    if (reposicionando) {
      // Não faça nada se estiver no modo de reposicionamento
      return;
    }
    else if (conteudoEfetivo === 0) {
      // Modal de iframe
      setIframeSrc(origemConteudo);
      setIsModalOpen(true);
    } else if (conteudoEfetivo === 2) {
      // Modal de texto
      setTextModalTitle(origemConteudo); // Define o título do modal
      setTextModalContent(descricaoCompleta); // Define o conteúdo de texto do modal
      setIsTextModalOpen(true); // Abre o modal de texto
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setIframeSrc('');
  };
  const closeTextModal = () => {
    setIsTextModalOpen(false);
    setTextModalContent('');
  };
  const togglePositionSelector = () => {
    setIsPositionSelectorActive(!isPositionSelectorActive);
    setHoveredPosition(null);
  };
  const toggleDataFetch = () => {
    setIsDataFetchActive(!isDataFetchActive);
    setReposicionando(false);
    setHoveredPosition(null);
    console.log("Reposicionando")
  };
  useEffect(() => {
    console.log("Modo reposicionamento:", reposicionando);
  }, [reposicionando]);
  const handleMouseOver = (row, col) => {
    if (isPositionSelectorActive || isDataFetchActive) {
      setHoveredPosition({ row, col });
    }
  };
  const handlePositionSelect = (row, col) => {
    if (isDataFetchActive) {
      fetchMosaicByPosition(row, col);
      setIsDataFetchActive(false); // Desativa o modo "Pegar Dados" após a busca
      setReposicionando(true);
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
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Evita scroll da página
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('Texto copiado para a área de transferência (fallback).');
    } catch (err) {
      console.error('Erro ao copiar texto (fallback):', err);
    }
    document.body.removeChild(textArea);
  };
  const copyPositionToCookiesAndNavigate = (row, col) => {
    document.cookie = `position_row=${row}; path=/; max-age=${60 * 60 * 24 * 7}`;
    document.cookie = `position_col=${col}; path=/; max-age=${60 * 60 * 24 * 7}`;
    const positionText = `Linha ${row}, Coluna ${col}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(positionText)
        .then(() => {
          fetchMosaicByPosition(row, col);
          navigate('/TLM-Producao/MosaicEditor');
        })
        .catch((err) => {
          console.error('Erro ao copiar o texto:', err);
          fallbackCopyTextToClipboard(positionText); // Usa o fallback
        });
    } else {
      fallbackCopyTextToClipboard(positionText);
      fetchMosaicByPosition(row, col);
      navigate('/TLM-Producao/MosaicEditor');
    }
  };
  const updateMosaicInDatabase = async (mosaicData) => {
    try {
      const response = await fetch(`https://link.tlm.net.br/api/mosaics/modify-position/${mosaicData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posicao_linha: mosaicData.posicao_linha,
          posicao_coluna: mosaicData.posicao_coluna
        }),
      });
      if (response.ok) {
        addAlert('Posição do mosaico atualizada com sucesso no banco de dados!', 'success');
        // Recarrega a página
        window.location.reload();
        addAlert('Posição do mosaico atualizada com sucesso no banco de dados!', 'success');
      } else {
        console.error('Erro ao atualizar posição do mosaico no banco de dados');
      }
    } catch (error) {
      console.error('Erro ao enviar atualização da posição do mosaico:', error);
      addAlert('Erro ao enviar atualização da posição do mosaico', 'error');
    }
  };
  const renderIcon = (icon) => (
    <div
      className="icon-container"
      onMouseEnter={() => setHoveredIconData({ id: icon.id, titulo_celula: icon.titulo_celula })} // Exibe os dados ao passar o mouse
      onMouseLeave={() => setHoveredIconData(null)} // Limpa os dados ao sair com o mouse
    >
      {icon.conteudo_efetivo === 0 ? ( // Verifica se o ícone deve ser um iframe
        <img
          src={icon.src} // Usa o ícone associado ao mosaico
          alt={icon.titulo_celula}
          className="icon"
          onClick={reposicionando ? null : () => handleIconClick(icon.origem_conteudo, '', 0)} // Desativa o clique em reposicionamento
        />
      ) : icon.conteudo_efetivo === 2 ? ( // Verifica se o ícone é de texto
        <img
          src={icon.src} // Exibe o ícone normalmente
          alt={icon.titulo_celula}
          className="icon"
          onClick={reposicionando ? null : () => handleIconClick(icon.origem_conteudo, icon.descricao_completa, 2)} // Passa descricao_completa para o conteúdo de texto
        />
      ) : (
        <img
          src={icon.src}
          alt={icon.titulo_celula}
          className="icon"
        />
      )}
      {hoveredIconData && hoveredIconData.id === icon.id && (
        <div className="hover-text">
          <span>ID: {hoveredIconData.id} | </span>
          <span>{hoveredIconData.titulo_celula}</span>
        </div>
      )}
    </div>
  );
  const handleLogout = () => {
    // Limpa o lastLogin do localStorage
    localStorage.removeItem("lastLogin");
    // Redireciona para a tela de login
    window.location.href = "/";
  };
  const squares = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const adjustedRow = row + 1 + offsetY;
      const adjustedCol = col + 1 + offsetX;
      const id = `square-${adjustedCol}-${adjustedRow}`;
      const isSelected = xValue === adjustedCol && yValue === adjustedRow;

      const iconInSquare = displayIcons.find(
        (icon) => icon.posicao_linha === adjustedRow && icon.posicao_coluna === adjustedCol
      );

      return (
        <div
          key={id}
          id={id}
          className={`square ${isSelected ? "selected-square" : ""}`}
          onMouseOver={() => handleMouseOver(adjustedRow, adjustedCol)}
          onClick={() => handlePositionSelect(adjustedRow, adjustedCol)}
        >
          {iconInSquare ? renderIcon(iconInSquare) : null}
        </div>
      );
    })
  ).flat();
  return (
    <div className="grid-container">
      <div className="menu-icon" onClick={toggleMenuVisibility}>
        <span>✏️</span> {/* Ícone de interrogação */}
      </div>
      <div className="menu-icon2" onClick={handleLogout} x>
        <span>❌</span> {/* Ícone de X */}
      </div>
      <div className={`button-container ${isMenuVisible ? 'visible' : 'hidden'}`}>
        <h4>Modo de edição</h4>
        <button id="teste" className="editar-mosaico" onClick={() => setIsPositionSelectorActive(!isPositionSelectorActive)}>
          {isPositionSelectorActive ? 'Desativar Seleção de Posição' : 'Selecionar Posição'}
        </button>
        <button
          id="teste2"
          onClick={() => {
            setIsDataFetchActive(!isDataFetchActive); // Alterna o estado de isDataFetchActive
            setReposicionando((prev) => !prev);      // Alterna o estado de reposicionando
          }}
        >
          {isDataFetchActive ? 'Cancelar' : 'Reposicionar Mosaico'}
        </button>
        <Link to="/TLM-Producao/MosaicEditor">
          <button id="teste3" className="icon-editor-button">Editor de Mosaicos</button>
        </Link>
        <Link to="/TLM-Producao/Editor">
          <button id="teste3" className="icon-editor-button">Editor de Icones</button>
        </Link>
        <button
          id="teste4"
          onClick={() => setIsNewPositionActive(!isNewPositionActive)}
        >
          {isNewPositionActive ? 'Cancelar' : 'Nova Posição'}
        </button>

        {isNewPositionActive && (
          <div className="position-inputs">
            <label>
              X:
              <input
                type="number"
                min="1"
                max={cols}
                value={xValue}
                onChange={handleXChange}
                placeholder="Posição X"
              />
            </label>
            <label>
              Y:
              <input
                type="number"
                min="1"
                max={rows}
                value={yValue}
                onChange={handleYChange}
                placeholder="Posição Y"
              />
            </label>
            <button onClick={() => { handleNewPosition(); handleMatrixMovement(); handlePositionConfirmation() }}>Ir para Posição</button>
            {/* Exibição da posição atual */}
            <div className="current-position">
              <p>Posição atual: X = {confirmedPosition.x}, Y = {confirmedPosition.y}</p>
            </div>
          </div>
        )}
      </div>
      {squares}
      {/* Div que você pediu para colocar */}
      <div className="additional-div">
        {/* Aqui você pode adicionar qualquer conteúdo que deseje na nova div */}
        {/*<button id='teste31' onClick={handleLogout}>Voltar</button>*/}
      </div>
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
      {/* Modal de texto */}
      {isTextModalOpen && (
        <TextModal title={textModalTitle} textContent={textModalContent} onClose={closeTextModal} />
      )}
    </div>
  );
};
const TextModal = ({ title, textContent, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>{textContent}</h2> {/* Título do modal */}
      <div className="text-content">{title}</div>

    </div>
  </div>
);
export default Grid;