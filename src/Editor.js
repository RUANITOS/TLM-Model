import React, { useState, useEffect } from 'react';
import './styles/Editor.css';
import Header from './components/Header';
import './styles/Login.css';

const IconEditor = () => {
  const [formData, setFormData] = useState({
    id: '',
    src: null,
    descricao: '',
    newId: '',
  });
  const [iconIds, setIconIds] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [modificationDate, setModificationDate] = useState(null);

  const fetchIconIds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/icons/ids');
      if (response.ok) {
        const data = await response.json();
        setIconIds(data);
      } else {
        console.error('Erro ao buscar IDs de ícones');
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  const fetchIconById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/icons/${id}`);
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
        console.error('Erro ao buscar o ícone:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  useEffect(() => {
    fetchIconIds();
  }, []);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, src: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/icons/delete/${selectedId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Ícone deletado com sucesso!');
        fetchIconIds();
        resetForm();
      } else {
        const error = await response.text();
        console.error('Erro ao deletar o ícone:', error);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    const isAdding = !selectedId;

    if (isAdding) {
      formDataToSend.append('icon_id', formData.id);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('dt_criacao', new Date().toISOString());
    } else {
      formDataToSend.append('icon_id', selectedId);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('dt_modificacao', new Date().toISOString());
    }

    try {
      const url = `http://localhost:5000/api/icons/${isAdding ? 'add' : 'modify'}`;
      const method = isAdding ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        alert(`Ícone ${isAdding ? 'adicionado' : 'modificado'} com sucesso!`);
        fetchIconIds();
        resetForm();
      } else {
        const error = await response.text();
        console.error('Erro ao enviar os dados:', error);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  const resetForm = () => {
    setFormData({ id: '', src: null, descricao: '', newId: '' });
    setSelectedId('');
    setImagePreview(null);
    setCreationDate(null);
    setModificationDate(null);
  };

  return (
    <div className="icon-editor-container">
      <Header />
      <div className="icon-editor-label-title">
        <h2 className="icon-editor-title">Editor de Ícones</h2>
      </div>

      <form className="icon-editor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="icon-editor-label">ID do Ícone:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedId(id);
              setFormData({ ...formData, id });
              if (id.length <= 3) fetchIconById(id);
            }}
            placeholder="Digite o ID do ícone"
            className="icon-editor-input"
            required
          />
        </div>

        {creationDate && (
          <div className="form-group">
            <label className="icon-editor-label">Data de Criação:</label>
            <input
              type="text"
              value={new Date(creationDate).toLocaleString()}
              readOnly
              className="icon-editor-input"
            />
          </div>
        )}

        {modificationDate && (
          <div className="form-group">
            <label className="icon-editor-label">Última Modificação:</label>
            <input
              type="text"
              value={new Date(modificationDate).toLocaleString()}
              readOnly
              className="icon-editor-input"
            />
          </div>
        )}

        {imagePreview && (
          <div className="form-group">
            <label className="icon-editor-label-imagem">Imagem Atual:</label>
            <img src={imagePreview} alt="Preview" className="icon-preview-imagem" />
          </div>
        )}

        <div className="form-group">
          <label className="icon-editor-label">Descrição:</label>
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Digite a descrição do ícone"
            className="icon-editor-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="icon-editor-label">Carregar Imagem:</label>
          <input
            type="file"
            name="src"
            onChange={handleChange}
            accept="image/*"
            className="icon-editor-input-file"
            required={!selectedId}
          />
        </div>

        <button type="submit" className="icon-editor-button-salvar">
          {selectedId ? 'Atualizar' : 'Salvar'}
        </button>
        {selectedId && (
          <button type="button" className="icon-editor-button-deletar delete-button" onClick={handleDelete}>
            Deletar
          </button>
        )}
      </form>
    </div>
  );
};

export default IconEditor;
