import React, { useState, useEffect } from 'react';
import './styles/Editor.css';
import './styles/Login.css';
import Header from './components/Header';
import { Link } from 'react-router-dom';
import { useAlertas } from './contexts/AlertasContext'; // Importa o contexto de alertas

const IconEditor = () => {
  const [formData, setFormData] = useState({
    id: '',
    src: null,
    descricao: '',
    id_implementacao: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [modificationDate, setModificationDate] = useState(null);
  const [isNewIcon, setIsNewIcon] = useState(false); // Para determinar se o ID não existe no banco
  const { addAlert } = useAlertas();

  const fetchIconById = async (id) => {
    try {
      const response = await fetch(`https://link.tlm.net.br/api/icons/${id}`);
      if (response.ok) {
        const { src, descricao, id_implementacao, dt_criacao, dt_modificacao } = await response.json();

        if (src && Array.isArray(src.data) && src.type) {
          const blob = new Blob([Uint8Array.from(src.data)], { type: src.type });
          const imageUrl = URL.createObjectURL(blob);
          setImagePreview(imageUrl);
        }

        setCreationDate(dt_criacao);
        setModificationDate(dt_modificacao);
        setFormData({ id, descricao, id_implementacao, src: null });
        setIsNewIcon(false); // ID encontrado
      } else if (response.status === 404) {
        setIsNewIcon(true); // ID não encontrado
        setImagePreview(null);
        setFormData({ id, descricao: '', id_implementacao: '', src: null });
        setCreationDate(null);
        setModificationDate(null);
      } else {
        console.error('Erro ao buscar o ícone:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`https://link.tlm.net.br/api/icons/delete/${formData.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        addAlert('Ícone deletado com sucesso!', 'success');
        setImagePreview(null);
        setFormData({ id: '', src: null, descricao: '', id_implementacao: '' });
        setCreationDate(null);
        setModificationDate(null);
        setIsNewIcon(false);
      } else {
        const error = await response.text();
        console.error('Erro ao deletar o ícone:', error);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, src: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append('icon_id', formData.id);
    formDataToSend.append('src', formData.src);
    formDataToSend.append('descricao', formData.descricao);
    formDataToSend.append('id_implementacao', formData.id_implementacao);

    if (isNewIcon) {
      formDataToSend.append('dt_criacao', new Date().toISOString());
    } else {
      formDataToSend.append('dt_modificacao', new Date().toISOString());
    }

    try {
      const url = `https://link.tlm.net.br/api/icons/${isNewIcon ? 'add' : 'modify'}`;
      const method = isNewIcon ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        addAlert(`Ícone ${isNewIcon ? 'adicionado' : 'modificado'} com sucesso!`, 'success');
        setImagePreview(null);
        setFormData({ id: '', src: null, descricao: '', id_implementacao: '' });
        setIsNewIcon(false);
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
      <h2 className="icon-editor-title">Editor de Ícones</h2>
      <form className="icon-editor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="icon-editor-label">ID do Ícone:</label>
          <input
            type="number"
            maxLength="3"
            value={formData.id}
            onChange={(e) => {
              const newId = e.target.value;
              setFormData((prev) => ({ ...prev, id: newId }));
              if (newId.length > 0) fetchIconById(newId);
            }}
            placeholder="Digite o ID do ícone"
            className="icon-editor-input"
            required
          />
        </div>

        {imagePreview && !isNewIcon && (
          <div className="view-icon">
            <label className="icon-editor-label-imagem">Imagem Preview:</label>
            <img src={imagePreview} alt="Imagem preview" className="icon-editor-img-preview" />
          </div>
        )}

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

        <div className="form-group">
          <label className="icon-editor-label">ID de Implementação:</label>
          <input
            type="text"
            name="id_implementacao"
            value={formData.id_implementacao}
            onChange={handleChange}
            placeholder="Digite o ID de implementação"
            className="icon-editor-input"
            required
          />
        </div>

        <button type="submit" className="icon-editor-button-atualizar">
          {isNewIcon ? 'Salvar' : 'Atualizar'}
        </button>
        {!isNewIcon && (
          <button
            type="button"
            className="icon-editor-button-deletar"
            onClick={handleDelete}
            id='botao-deletar'
          >
            Deletar
          </button>
        )}
        <Link to="/" className="voltar-mosaic">Voltar</Link>
      </form>
    </div>
  );
};

export default IconEditor;
