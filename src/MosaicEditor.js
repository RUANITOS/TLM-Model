import React, { useState, useEffect } from 'react';
import './styles/Editor.css';
import Header from './components/Header';

const MosaicEditor = () => {
  const [formData, setFormData] = useState({
    id_implem: '',
    descricao_completa: '',
    descricao_resumida: '',
    posicao_linha: '',
    posicao_coluna: '',
    codigo_id_icone: '',
    conteudo_efetivo: '',
    src: null,
    newId: '',
  });
  const [mosaicIds, setMosaicIds] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [action, setAction] = useState('add');
  const [imagePreview, setImagePreview] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [modificationDate, setModificationDate] = useState(null);

  // Fetch all mosaic IDs
  const fetchMosaicIds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mosaics/ids');
      if (response.ok) {
        const data = await response.json();
        setMosaicIds(data);
      } else {
        console.error('Erro ao buscar IDs de mosaicos');
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  // Fetch a specific mosaic by ID
  const fetchMosaicById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/mosaics/${id}`);
      if (response.ok) {
        const { src, descricao_completa, descricao_resumida, dt_criacao, dt_ultima_atualizacao, posicao_linha, posicao_coluna, codigo_id_icone } = await response.json();

        if (src && Array.isArray(src.data) && src.type) {
          const blob = new Blob([Uint8Array.from(src.data)], { type: src.type });
          const imageUrl = URL.createObjectURL(blob);
          setImagePreview(imageUrl);
        }

        setCreationDate(dt_criacao);
        setModificationDate(dt_ultima_atualizacao);
        setFormData({ 
          ...formData, 
          descricao_completa, 
          descricao_resumida, 
          posicao_linha, 
          posicao_coluna, 
          codigo_id_icone 
        });
      } else {
        console.error('Erro ao buscar o mosaico:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  useEffect(() => {
    fetchMosaicIds();
  }, []);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, src: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setSelectedId('');
    setImagePreview(null);
    setFormData({ 
      id_implem: '', 
      descricao_completa: '', 
      descricao_resumida: '', 
      posicao_linha: '', 
      posicao_coluna: '', 
      codigo_id_icone: '', 
      conteudo_efetivo: '', 
      src: null, 
      newId: '' 
    });
    setCreationDate(null);
    setModificationDate(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/mosaics/delete/${selectedId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Mosaico deletado com sucesso!');
        fetchMosaicIds();
        setImagePreview(null);
        setFormData({ 
          id_implem: '', 
          descricao_completa: '', 
          descricao_resumida: '', 
          posicao_linha: '', 
          posicao_coluna: '', 
          codigo_id_icone: '', 
          conteudo_efetivo: '', 
          src: null, 
          newId: '' 
        });
        setSelectedId('');
      } else {
        const error = await response.text();
        console.error('Erro ao deletar o mosaico:', error);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    if (action === 'add') {
      formDataToSend.append('id_implem', formData.id_implem);
      formDataToSend.append('descricao_completa', formData.descricao_completa);
      formDataToSend.append('descricao_resumida', formData.descricao_resumida);
      formDataToSend.append('posicao_linha', formData.posicao_linha);
      formDataToSend.append('posicao_coluna', formData.posicao_coluna);
      formDataToSend.append('codigo_id_icone', formData.codigo_id_icone);
      formDataToSend.append('conteudo_efetivo', formData.conteudo_efetivo);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('dt_criacao', new Date().toISOString());
    } else if (action === 'modify') {
      formDataToSend.append('id_implem', selectedId);
      formDataToSend.append('descricao_completa', formData.descricao_completa);
      formDataToSend.append('descricao_resumida', formData.descricao_resumida);
      formDataToSend.append('posicao_linha', formData.posicao_linha);
      formDataToSend.append('posicao_coluna', formData.posicao_coluna);
      formDataToSend.append('codigo_id_icone', formData.codigo_id_icone);
      formDataToSend.append('conteudo_efetivo', formData.conteudo_efetivo);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('dt_ultima_atualizacao', new Date().toISOString());
    }

    try {
      const url = `http://localhost:5000/api/mosaics/${action === 'add' ? 'add' : 'modify'}`;
      const method = action === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        alert(`Mosaico ${action === 'add' ? 'adicionado' : 'modificado'} com sucesso!`);
        fetchMosaicIds();
        setImagePreview(null);
        setFormData({ 
          id_implem: '', 
          descricao_completa: '', 
          descricao_resumida: '', 
          posicao_linha: '', 
          posicao_coluna: '', 
          codigo_id_icone: '', 
          conteudo_efetivo: '', 
          src: null, 
          newId: '' 
        });
        setSelectedId('');
      } else {
        const error = await response.text();
        console.error('Erro ao enviar os dados:', error);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  return (
    <div className="mosaic-editor-container">
      <Header />
      <div className="mosaic-editor-label-title">
        <h2 className="mosaic-editor-title">Editor de Mosaicos</h2>
      </div>

      <select className="select" onChange={handleActionChange} value={action}>
        <option value="add">Adicionar Mosaico</option>
        <option value="modify">Modificar Mosaico</option>
      </select>

      <form className="mosaic-editor-form" onSubmit={handleSubmit}>
        {action === 'add' && (
          <>
            <div className="form-group">
              <label className="mosaic-editor-label">ID do Mosaico:</label>
              <input
                type="number"
                name="id_implem"
                value={formData.id_implem}
                onChange={handleChange}
                placeholder="Digite o ID do mosaico"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="mosaic-editor-label">Descrição Completa:</label>
              <input
                type="text"
                name="descricao_completa"
                value={formData.descricao_completa}
                onChange={handleChange}
                placeholder="Digite a descrição completa do mosaico"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="mosaic-editor-label">Descrição Resumida:</label>
              <input
                type="text"
                name="descricao_resumida"
                value={formData.descricao_resumida}
                onChange={handleChange}
                placeholder="Digite a descrição resumida do mosaico"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="mosaic-editor-label">Linha:</label>
              <input
                type="number"
                name="posicao_linha"
                value={formData.posicao_linha}
                onChange={handleChange}
                placeholder="Digite a posição da linha"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="mosaic-editor-label">Coluna:</label>
              <input
                type="number"
                name="posicao_coluna"
                value={formData.posicao_coluna}
                onChange={handleChange}
                placeholder="Digite a posição da coluna"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="mosaic-editor-label">Código do Ícone:</label>
              <input
                type="number"
                name="codigo_id_icone"
                value={formData.codigo_id_icone}
                onChange={handleChange}
                placeholder="Digite o código do ícone"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="mosaic-editor-label">Conteúdo Efetivo:</label>
              <input
                type="text"
                name="conteudo_efetivo"
                value={formData.conteudo_efetivo}
                onChange={handleChange}
                placeholder="Digite o conteúdo efetivo do mosaico"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="mosaic-editor-label">Imagem:</label>
              <input
                type="file"
                name="src"
                onChange={handleChange}
                className="mosaic-editor-input"
                required
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>
          </>
        )}

        {action === 'modify' && (
          <div className="form-group">
            <label className="mosaic-editor-label">Selecione o ID do Mosaico:</label>
            <select
              className="select"
              onChange={(e) => {
                setSelectedId(e.target.value);
                fetchMosaicById(e.target.value);
              }}
              value={selectedId}
              required
            >
              <option value="">Selecione um ID</option>
              {mosaicIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>

            {selectedId && (
              <>
                <div className="form-group">
                  <label className="mosaic-editor-label">Descrição Completa:</label>
                  <input
                    type="text"
                    name="descricao_completa"
                    value={formData.descricao_completa}
                    onChange={handleChange}
                    placeholder="Digite a descrição completa do mosaico"
                    className="mosaic-editor-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="mosaic-editor-label">Descrição Resumida:</label>
                  <input
                    type="text"
                    name="descricao_resumida"
                    value={formData.descricao_resumida}
                    onChange={handleChange}
                    placeholder="Digite a descrição resumida do mosaico"
                    className="mosaic-editor-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="mosaic-editor-label">Linha:</label>
                  <input
                    type="number"
                    name="posicao_linha"
                    value={formData.posicao_linha}
                    onChange={handleChange}
                    placeholder="Digite a posição da linha"
                    className="mosaic-editor-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="mosaic-editor-label">Coluna:</label>
                  <input
                    type="number"
                    name="posicao_coluna"
                    value={formData.posicao_coluna}
                    onChange={handleChange}
                    placeholder="Digite a posição da coluna"
                    className="mosaic-editor-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="mosaic-editor-label">Código do Ícone:</label>
                  <input
                    type="number"
                    name="codigo_id_icone"
                    value={formData.codigo_id_icone}
                    onChange={handleChange}
                    placeholder="Digite o código do ícone"
                    className="mosaic-editor-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="mosaic-editor-label">Conteúdo Efetivo:</label>
                  <input
                    type="text"
                    name="conteudo_efetivo"
                    value={formData.conteudo_efetivo}
                    onChange={handleChange}
                    placeholder="Digite o conteúdo efetivo do mosaico"
                    className="mosaic-editor-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="mosaic-editor-label">Imagem:</label>
                  <input
                    type="file"
                    name="src"
                    onChange={handleChange}
                    className="mosaic-editor-input"
                  />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                </div>
              </>
            )}
          </div>
        )}

        <button type="submit" className="mosaic-editor-button">Salvar</button>
        {action === 'modify' && (
          <button type="button" className="mosaic-editor-button" onClick={handleDelete}>
            Deletar Mosaico
          </button>
        )}
      </form>

      {creationDate && (
        <div className="mosaic-editor-date">
          <p>Data de Criação: {new Date(creationDate).toLocaleDateString()}</p>
        </div>
      )}
      {modificationDate && (
        <div className="mosaic-editor-date">
          <p>Data da Última Atualização: {new Date(modificationDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default MosaicEditor;
