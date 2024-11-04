import React, { useState, useEffect } from 'react';
import './styles/Editor.css';
import Header from './components/Header';

const MosaicEditor = () => {
  const [formData, setFormData] = useState({
    id: '',
    descricao: '',
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
        const { src, descricao, dt_criacao, dt_modificacao } = await response.json();

        if (src && Array.isArray(src.data) && src.type) {
          const blob = new Blob([Uint8Array.from(src.data)], { type: src.type });
          const imageUrl = URL.createObjectURL(blob);
          setImagePreview(imageUrl);
        }

        setCreationDate(dt_criacao);
        setModificationDate(dt_modificacao);
        setFormData({ ...formData, descricao });
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
    setFormData({ id: '', descricao: '', src: null, newId: '' });
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
        setFormData({ id: '', descricao: '', src: null, newId: '' });
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
      formDataToSend.append('id_implem', formData.id);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('dt_criacao', new Date().toISOString());
    } else if (action === 'modify') {
      formDataToSend.append('id_implem', selectedId);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('dt_modificacao', new Date().toISOString());
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
        setFormData({ id: '', descricao: '', src: null, newId: '' });
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
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Digite o ID do mosaico"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="mosaic-editor-label">Descrição:</label>
              <input
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Digite a descrição do mosaico"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="mosaic-editor-label">Carregar Imagem:</label>
              <input
                type="file"
                name="src"
                onChange={handleChange}
                accept="image/*"
                className="mosaic-editor-input-file"
                required
              />
            </div>

            <button type="submit" className="mosaic-editor-button">Salvar</button>
          </>
        )}

        {action === 'modify' && (
          <>
            <div className="form-group">
              <label className="mosaic-editor-label">Digite o ID do Mosaico:</label>
              <input
                type="text"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  if (e.target.value) {
                    fetchMosaicById(e.target.value);
                  }
                }}
                placeholder="Digite o ID do mosaico"
                className="mosaic-editor-input"
                required
              />
            </div>

            <div className="visualization-section">
              {creationDate && (
                <div className="form-group">
                  <label className="mosaic-editor-label">Data de Criação:</label>
                  <input
                    type="text"
                    value={new Date(creationDate).toLocaleString()}
                    readOnly
                    className="mosaic-editor-input"
                  />
                </div>
              )}

              {modificationDate && (
                <div className="form-group">
                  <label className="mosaic-editor-label">Última Modificação:</label>
                  <input
                    type="text"
                    value={new Date(modificationDate).toLocaleString()}
                    readOnly
                    className="mosaic-editor-input"
                  />
                </div>
              )}

              {imagePreview && (
                <div className="form-group">
                  <label className="mosaic-editor-label">Imagem Atual:</label>
                  <img src={imagePreview} alt="Preview" className="mosaic-preview" />
                </div>
              )}
            </div>

            <div className="modification-section">
              <div className="form-group">
                <label className="mosaic-editor-label">Descrição:</label>
                <input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Digite a nova descrição"
                  className="mosaic-editor-input"
                />
              </div>

              <div className="form-group">
                <label className="mosaic-editor-label">Carregar Nova Imagem:</label>
                <input
                  type="file"
                  name="src"
                  onChange={handleChange}
                  accept="image/*"
                  className="mosaic-editor-input-file"
                />
              </div>

              <button type="submit" className="mosaic-editor-button">Modificar</button>
              <button type="button" className="mosaic-editor-delete-button" onClick={handleDelete}>
                Deletar
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default MosaicEditor;
