import React, { useState, useEffect } from 'react';
import './styles/Editor.css';
import Header from './components/Header';
import { Link } from 'react-router-dom';
import { useAlertas } from './contexts/AlertasContext'; // Importa o contexto de alertas

function MosaicForm() {
  const [formData, setFormData] = useState({
    posicao_linha: '',
    posicao_coluna: '',
    titulo_celula: '',
    id_icone: '',
    descricao_completa: '',
    descricao_resumida: '',
    conteudo_efetivo: '',
    origem_conteudo: '',
  });
  const [mosaicId, setMosaicId] = useState('');
  const [iconIds, setIconIds] = useState([]);
  const [action, setAction] = useState('add');
  const { addAlert } = useAlertas();
  const [isIconMenuOpen, setIconMenuOpen] = useState(false);
  const [availableIcons, setAvailableIcons] = useState([]);
  const idImplem = document.cookie
    .split('; ')
    .find(row => row.startsWith('id_implem='))
    ?.split('=')[1];
  const fetchAvailableIcons = async () => {
    try {
      // Buscar Ícones Gerais (id_implem = 0)
      const responseGerais = await fetch(
        'https://apimosaic-c3aba7a2acfnh6fd.canadacentral-01.azurewebsites.net/api/icons/implementation/0'
      );
      const iconsGeraisData = await responseGerais.json();

      // Processar Ícones Gerais
      const processedGerais = iconsGeraisData.map(icon => {
        if (icon.src && icon.src.data) {
          const imgBlob = new Blob([new Uint8Array(icon.src.data)], { type: 'image/png' });
          const imgUrl = URL.createObjectURL(imgBlob);
          return { ...icon, src: imgUrl };
        }
        return null;
      });

      // Buscar Ícones Pessoais (baseado no id_implem do usuário)
      const responsePessoais = await fetch(
        `https://apimosaic-c3aba7a2acfnh6fd.canadacentral-01.azurewebsites.net/api/icons/implementation/${idImplem}`
      );
      const iconsPessoaisData = await responsePessoais.json();

      // Processar Ícones Pessoais
      const processedPessoais = iconsPessoaisData.map(icon => {
        if (icon.src && icon.src.data) {
          const imgBlob = new Blob([new Uint8Array(icon.src.data)], { type: 'image/png' });
          const imgUrl = URL.createObjectURL(imgBlob);
          return { ...icon, src: imgUrl };
        }
        return null;
      });

      // Combinar ícones gerais e pessoais e atualizar o estado
      setAvailableIcons([
        ...processedGerais.filter(icon => icon !== null),
        ...processedPessoais.filter(icon => icon !== null),
      ]);
    } catch (error) {
      console.error('Erro ao buscar ícones:', error);
    }
  };

  useEffect(() => {
    if (isIconMenuOpen) {
      fetchAvailableIcons();
    }
  }, [isIconMenuOpen]);

  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const getFromLocalStorage = (key) => {
    return localStorage.getItem(key) ? localStorage.getItem(key) : '';
  };
  //função auxiliar para buscarmos o cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  useEffect(() => {
    // Obtém o ID do mosaico do cookie e atualiza o estado inicial
    const idMosaicFromCookie = getCookie('mosaic_id');
    if (idMosaicFromCookie) {
      setMosaicId(idMosaicFromCookie);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const id_mosaico = getFromLocalStorage('id') || '';
      const positionRow = getCookie('position_row'); // Lê o valor do cookie para linha
      const positionCol = getCookie('position_col'); // Lê o valor do cookie para coluna
      const tituloCelula = getFromLocalStorage('titulo_celula');
      const idIcone = getFromLocalStorage('id_icone');
      const descricaoCompleta = getFromLocalStorage('descricao_completa');
      const descricaoResumida = getFromLocalStorage('descricao_resumida');
      const conteudoEfetivo = getFromLocalStorage('conteudo_efetivo');
      const origemConteudo = getFromLocalStorage('origem_conteudo');

      // Verifica se a mensagem de erro está no localStorage
      const errorMessage = getFromLocalStorage('message');
      if (errorMessage === 'Mosaico não encontrado para a posição fornecida') {
        setFormData((prevFormData) => ({
          ...prevFormData,
          posicao_linha: positionRow || '', // Popula a linha com o valor do cookie
          posicao_coluna: positionCol || '', // Popula a coluna com o valor do cookie
          titulo_celula: '',
          id_icone: '',
          descricao_completa: '',
          descricao_resumida: '',
          conteudo_efetivo: '',
          origem_conteudo: '',
        }));
      } else {
        setFormData({
          posicao_linha: positionRow || '',
          posicao_coluna: positionCol || '',
          titulo_celula: tituloCelula || '',
          id_icone: idIcone || '',
          descricao_completa: descricaoCompleta || '',
          descricao_resumida: descricaoResumida || '',
          conteudo_efetivo: conteudoEfetivo || '',
          origem_conteudo: origemConteudo || '',
        });
      }

      const mosaicData = getCookie('mosaic_data');
      if (mosaicData) {
        const parsedData = JSON.parse(mosaicData);
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...parsedData,
        }));
      }
    }
  }, [loading]);


  useEffect(() => {
    setLoading(false); // Definindo que a página carregou completamente
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'id_icone') {
      fetchIconIds(value); // Chama a função para buscar o ícone quando o ID for alterado
    }
  };
  // Função para buscar os IDs de ícones
  const fetchIconIds = async (id) => {
    if (!id) return; // Não faz fetch se o ID estiver vazio
    try {
      const response = await fetch(`https://apimosaic-c3aba7a2acfnh6fd.canadacentral-01.azurewebsites.net/api/icons/${id}`, {

      });
      if (response.ok) {
        const { src } = await response.json();
        if (src && Array.isArray(src.data) && src.type) {
          const blob = new Blob([Uint8Array.from(src.data)], { type: src.type });
          const imageUrl = URL.createObjectURL(blob);
          setImagePreview(imageUrl);
        } else {
          setImagePreview(null); // Se não encontrar imagem
        }
      } else {
        setImagePreview(null); // Se falhar ao buscar o ícone
      }
    } catch (error) {
      console.error('Erro ao buscar o ícone:', error);
      setImagePreview(null);
    }
  };
  // Função para buscar um ícone por ID
  const fetchIconById = async (id) => {
    try {
      const response = await fetch(`https://apimosaic-c3aba7a2acfnh6fd.canadacentral-01.azurewebsites.net/api/icons/${id}`, {

      });
      if (response.ok) {
        const { src, } = await response.json();

        if (src && Array.isArray(src.data) && src.type) {
          const blob = new Blob([Uint8Array.from(src.data)], { type: src.type });
          const imageUrl = URL.createObjectURL(blob);
          setImagePreview(imageUrl);
        }
      } else {
        console.error('Erro ao buscar o ícone:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  useEffect(() => {
    fetchIconIds();
  }, []);

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setMosaicId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obter id_implem do cookie
      const idImplem = getCookie('id_implem');
      if (!idImplem) {
        addAlert('Erro: id_implem não encontrado nos cookies.', 'error');
        return;
      }

      // Atualizar formData com id_implem
      const updatedFormData = { ...formData, id_implem: idImplem };

      const response = await fetch('https://apimosaic-c3aba7a2acfnh6fd.canadacentral-01.azurewebsites.net/api/mosaics/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        addAlert('Mosaico adicionado com sucesso!', 'success');
        console.log(updatedFormData)
      } else {
        throw new Error('Erro ao adicionar mosaico');
      }
    } catch (error) {
      console.error(error);
      addAlert('Erro ao adicionar mosaico.', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!mosaicId) {
      addAlert('Por favor, forneça um ID de mosaico para modificar.', 'error');
      return;
    }
    try {
      // Obter id_implem do cookie
      const idImplem = getCookie('id_implem');
      if (!idImplem) {
        addAlert('Erro: id_implem não encontrado nos cookies.', 'error');
        return;
      }

      // Atualizar formData com id_implem
      const updatedFormData = { ...formData, id_implem: idImplem };

      const response = await fetch(`https://apimosaic-c3aba7a2acfnh6fd.canadacentral-01.azurewebsites.net/api/mosaics/modify/${mosaicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        addAlert('Mosaico modificado com sucesso!', 'success');
      } else {
        throw new Error('Erro ao modificar mosaico');
      }
    } catch (error) {
      console.error(error);
      addAlert('Erro ao modificar mosaico.', 'error');
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!mosaicId) {
      addAlert('Por favor, forneça um ID de mosaico para deletar.', 'error');
      return;
    }
    try {
      const response = await fetch(`https://apimosaic-c3aba7a2acfnh6fd.canadacentral-01.azurewebsites.net/api/mosaics/delete/${mosaicId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        addAlert('Mosaico deletado com sucesso!', 'success');
      } else {
        throw new Error('Erro ao deletar mosaico');
      }
    } catch (error) {
      console.error(error);
      addAlert('Erro ao deletar mosaico.', 'error');
    }
  };
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Verifica se o parâmetro `reloaded` está na URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasReloaded = urlParams.get('reloaded');

    if (isInitialLoad && !hasReloaded) {
      setIsInitialLoad(false);

      // Define um timer para recarregar a página após 1 segundo com o parâmetro `reloaded`
      setTimeout(() => {
        urlParams.set('reloaded', 'true');
        window.location.search = urlParams.toString();
      }, 1000);
    }
  }, [isInitialLoad]);

  const [tituloCelula, setTituloCelula] = useState("");
  const handleTituloChange = (e) => {
    if (e.target.value.length <= 30) {
      setTituloCelula(e.target.value); // Atualiza o estado com o novo valor
    }
  };

  return (
    <div className="icon-editor-container">
      <Header />
      <div className="icon-editor-label-title">
        <h2 className="icon-editor-title">Editor de Mosaicos</h2>
      </div>

      <form
        className="icon-editor-form"
      >
        {action === 'add' && (
          <>
            <div className="form-group">
              <label className="icon-editor-label">ID do Mosaico:</label>
              <input
                type="text"
                value={mosaicId || ''}
                onChange={(e) => setMosaicId(e.target.value)}
                className="icon-editor-input"
                placeholder="ID do mosaico a ser alterado"
                name='ID do Mosaico'
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Posição Linha:</label>
              <input
                type="number"
                name="posicao_linha"
                value={formData.posicao_linha}
                onChange={handleChange}
                className="icon-editor-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Posição Coluna:</label>
              <input
                type="number"
                name="posicao_coluna"
                value={formData.posicao_coluna}
                onChange={handleChange}
                className="icon-editor-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Título Célula:</label>
              <input
                type="text"
                name="titulo_celula"
                value={formData.titulo_celula}
                onChange={(e) => {
                  handleChange(e); // Chama o primeiro manipulador
                  handleTituloChange(e); // Chama o segundo manipulador
                }}
                className="icon-editor-input"
                required
              />
              <div className="char-counter">
                {formData.titulo_celula.length}/30
              </div>
            </div>
            <div className="form-group">

              <div >
                <label className="icon-editor-label">ID Ícone:</label>
                <input
                  type="number"
                  name="id_icone"
                  value={formData.id_icone}
                  onChange={(e) => {
                    handleChange(e);
                    fetchIconById(e.target.value); // Chama a função para buscar o ícone
                  }}
                  className="icon-editor-input"
                  required
                />
                <button
                  type="button"
                  className="choose-icon-button"
                  onClick={() => setIconMenuOpen(true)} // Abre o menu de seleção
                >
                  Escolher Ícone
                </button>
              </div>

              {isIconMenuOpen && (
                <div className="icon-menu2">
                  <h4>Ícones Gerais</h4>
                  <div className="icon-list2">
                    {availableIcons
                      .filter(icon => parseInt(icon.id_implementacao, 10) === 0) // Filtra ícones gerais
                      .map(icon => (
                        <div
                          key={icon.icon_id}
                          className="icon-item2"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, id_icone: icon.icon_id })); // Atualiza o ID do ícone no formulário
                            setIconMenuOpen(false); // Fecha o menu
                          }}
                        >
                          <p>{icon.icon_id}</p>
                          <img src={icon.src} alt={icon.titulo} className="menu-icon-image" />
                        </div>
                      ))}
                  </div>

                  <h4>Ícones Pessoais</h4>
                  <div className="icon-list2">
                    {availableIcons
                      .filter(icon => parseInt(icon.id_implementacao, 10) === parseInt(idImplem, 10)) // Filtra ícones pessoais
                      .map(icon => (
                        <div
                          key={icon.icon_id}
                          className="icon-item2"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, id_icone: icon.icon_id })); // Atualiza o ID do ícone no formulário
                            setIconMenuOpen(false); // Fecha o menu
                          }}
                        >
                          <p>{icon.icon_id}</p>
                          <img src={icon.src} alt={icon.titulo} className="menu-icon-image" />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            {imagePreview && (
              <div className="view-icon-mosaic2">
                <label className="icon-editor-label-imagem">Imagem Preview:</label>
                <img src={imagePreview} alt="Preview" className="icon-editor-img-preview" />
              </div>
            )}

            <div className="form-group">
              <label className="icon-editor-label">Descrição Completa:</label>
              <input
                type="text"
                name="descricao_completa"
                value={formData.descricao_completa}
                onChange={handleChange}
                className="icon-editor-input"
                required
              />
              <div className="char-counter">
                {formData.descricao_completa.length}/30
              </div>
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Descrição Resumida:</label>
              <input
                type="text"
                name="descricao_resumida"
                value={formData.descricao_resumida}
                onChange={handleChange}
                className="icon-editor-input"
                required
              />
              <div className="char-counter">
                {formData.descricao_resumida.length}/10
              </div>
            </div>
            <div className="form-group">
              Tipo de conteudo:
              <select
                name="conteudo_efetivo"
                value={formData.conteudo_efetivo}
                onChange={handleChange}
                className="icon-editor-input"
                style={{ height: '20.6px', width: '318.6px' }}
                required
              >
                <option value="0">URL</option>
                <option value="1">Foto</option>
                <option value="2">Texto</option>
                <option value="3">Vídeo</option>
                <option value="4">Link Genérico</option>
              </select>
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Conteúdo:</label>
              <textarea
              
                name="origem_conteudo"
                value={formData.origem_conteudo}
                onChange={handleChange}
                className="icon-editor-input"
                required
              />
            </div>

            <button onClick={handleSubmit} id='botao-salvar' className="icon-editor-button">Adicionar</button>
            <button onClick={handleUpdate} id='botao-modificar' className="icon-editor-button-atualizar">Modificar</button>
            <button onClick={handleDelete} id='botao-deletar' className="icon-editor-button-deletar">Deletar</button>
          </>
        )}
        <Link to='/' className="voltar-mosaic">Voltar</Link>
      </form>

    </div>
  );
}

export default MosaicForm;