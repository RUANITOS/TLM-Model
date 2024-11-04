import React, { useState, useEffect } from 'react';
import './styles/Editor.css';
import Header from './components/Header';

const IconEditor = () => {
  const [formData, setFormData] = useState({
    id: '',
    src: null,
    descricao: '',
    newId: '',
  });
  const [iconIds, setIconIds] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [action, setAction] = useState('add');
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

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setSelectedId('');
    setImagePreview(null);
    setFormData({ id: '', src: null, descricao: '', newId: '' });
    setCreationDate(null);
    setModificationDate(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/icons/delete/${selectedId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Ícone deletado com sucesso!');
        fetchIconIds();
        setImagePreview(null);
        setFormData({ id: '', src: null, descricao: '', newId: '' });
        setSelectedId('');
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

    if (action === 'add') {
      formDataToSend.append('icon_id', formData.id);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('dt_criacao', new Date().toISOString());
    } else if (action === 'modify') {
      formDataToSend.append('icon_id', selectedId);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('dt_modificacao', new Date().toISOString());
    }

    try {
      const url = `http://localhost:5000/api/icons/${action === 'add' ? 'add' : 'modify'}`;
      const method = action === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        alert(`Ícone ${action === 'add' ? 'adicionado' : 'modificado'} com sucesso!`);
        fetchIconIds();
        setImagePreview(null);
        setFormData({ id: '', src: null, descricao: '', newId: '' });
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
    <div className="icon-editor-container">
      <Header />
      <div className='icon-editor-label-title'>
        <h2 className="icon-editor-title">Editor de ícones</h2>
      </div>

      <form className="icon-editor-form" onSubmit={handleSubmit}>
        {action === 'add' && (
          <>

            <select className='select' onChange={handleActionChange} value={action}>
              <option value="add">Adicionar Ícone</option>
              <option value="modify">Modificar Ícone</option>
            </select>

            <div className="form-group">
              <label className="icon-editor-label">ID do Ícone:</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Digite o ID do ícone"
                className="icon-editor-input"
                required
              />
            </div>

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
                required
              />
            </div>

            <button type="submit" className="icon-editor-button-salvar">Salvar</button>
          </>
        )}
          
        {action === 'modify' && (
          <>
              <select className='select' onChange={handleActionChange} value={action}>
                <option value="add">Adicionar Ícone</option>
                <option value="modify">Modificar Ícone</option>
              </select>
            <div className="form-group">
              <label className="icon-editor-label">ID do Ícone:</label>
              <input
                type="number"
                maxLength="3"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  if (e.target.value.length <= 3) {
                    fetchIconById(e.target.value);
                  }
                }}
                placeholder="Digite o ID do ícone"
                className="icon-editor-input"
                required
              />
            </div>

            {/* Seção de Visualização */}
            <div className="visualization-section">
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
            </div>

            {/* Seção de Alteração */}
            <div className="modification-section">
              <div className="form-group">
                <label className="icon-editor-label">Descrição:</label>
                <input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Digite a nova descrição"
                  className="icon-editor-input"
                />
              </div>

              <div className="form-group">
                <label className="icon-editor-label">Carregar Nova Imagem:</label>
                <input
                  type="file"
                  name="src"
                  onChange={handleChange}
                  accept="image/*"
                  className="icon-editor-input-file"
                />
              </div>

              <button type="submit" className="icon-editor-button-atualizar-deletar">Atualizar</button>
              <button type="button" className="icon-editor-button-atualizar-deletar delete-button" onClick={handleDelete}>
                Deletar
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default IconEditor;
