// backend/components/IconEditor.js
import React, { useState, useEffect } from 'react';
import './styles/Editor.css';

const IconEditor = () => {
  const [formData, setFormData] = useState({
    id: '',
    src: null,
  });
  const [iconIds, setIconIds] = useState([]); // IDs já cadastrados

  useEffect(() => {
    fetchIconIds(); // Chama ao montar o componente
  }, []);

  const fetchIconIds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/icons/ids');
      const data = await response.json();
      setIconIds(data);
    } catch (error) {
      console.error('Erro ao buscar IDs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, src: e.target.files[0] }); // Armazena o arquivo selecionado
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!formData.id || !formData.src) {
      alert("Por favor, preencha o ID do ícone e faça o upload de uma imagem.");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append('icon_id', formData.id);
    formDataToSend.append('src', formData.src); // Adiciona o arquivo à requisição

    try {
      const response = await fetch('http://localhost:5000/api/icons/add', {
        method: 'POST',
        body: formDataToSend,
      });
      if (response.ok) {
        alert('Ícone adicionado com sucesso!');
        setFormData({ id: '', src: null }); // Reseta o formulário após a adição
        fetchIconIds(); // Atualiza a lista de IDs
      } else {
        alert('Erro ao adicionar ícone.'); // Mensagem de erro
      }
    } catch (error) {
      console.error('Erro ao adicionar ícone:', error);
    }
  };

  const handleUpdate = async () => {
    if (!formData.id) {
      alert("Por favor, selecione um ID de ícone para atualizar.");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append('icon_id', formData.id);
    if (formData.src) formDataToSend.append('src', formData.src); // Adiciona o arquivo à requisição, se existir

    try {
      const response = await fetch(`http://localhost:5000/api/icons/update/${formData.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      if (response.ok) {
        alert('Ícone atualizado com sucesso!');
        setFormData({ id: '', src: null }); // Reseta o formulário após a atualização
        fetchIconIds(); // Atualiza a lista de IDs
      } else {
        alert('Erro ao atualizar ícone.'); // Mensagem de erro
      }
    } catch (error) {
      console.error('Erro ao atualizar ícone:', error);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) {
      alert("Por favor, selecione um ID de ícone para deletar.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/icons/delete/${formData.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Ícone deletado com sucesso!');
        setFormData({ id: '', src: null }); // Reseta o formulário após a deleção
        fetchIconIds(); // Atualiza a lista de IDs
      } else {
        alert('Erro ao deletar ícone.'); // Mensagem de erro
      }
    } catch (error) {
      console.error('Erro ao deletar ícone:', error);
    }
  };

  return (
    <div className="icon-editor-container">
      <h2 className="icon-editor-title">Criador de Ícones</h2>

      <form className="icon-editor-form" onSubmit={(e) => e.preventDefault()}>
        <label className="icon-editor-label">ID do Ícone:</label>
        <select
          name="id"
          value={formData.id}
          onChange={handleChange}
          className="icon-editor-input"
        >
          <option value="">Selecione um ID existente</option>
          {iconIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="Ou insira um novo ID"
          className="icon-editor-input"
        />

        <label className="icon-editor-label">Upload de Imagem (BLOB):</label>
        <input
          type="file"
          name="src"
          onChange={handleChange}
          accept="image/*"
          className="icon-editor-input-file"
        />

        <button type="button" className="icon-editor-button" onClick={handleSave}>Salvar Ícone</button>
        <button type="button" className="icon-editor-button" onClick={handleUpdate}>Atualizar Ícone</button>
        <button type="button" className="icon-editor-button" onClick={handleDelete}>Deletar Ícone</button>
      </form>
    </div>
  );
};

export default IconEditor;
