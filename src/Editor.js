import React, { useState, useEffect } from 'react';
import './styles/Editor.css';

const IconEditor = () => {
  const [formData, setFormData] = useState({
    id: '',
    src: null, // Imagem como BLOB
    newId: '', // Novo ID para modificar
  });

  const [iconIds, setIconIds] = useState([]); // Para armazenar os IDs de ícones
  const [selectedId, setSelectedId] = useState(''); // Para o ID selecionado no dropdown
  const [action, setAction] = useState('add'); // Para definir a ação (adicionar, modificar ou deletar)
  const [imagePreview, setImagePreview] = useState(null); // Para armazenar a visualização da imagem

  // Função para buscar os IDs dos ícones no backend
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

// Função para buscar a imagem correspondente ao ID selecionado
const fetchIconById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/icons/${id}`);
    if (response.ok) {
      const { src } = await response.json();

      // Verifica se src.data e src.type estão presentes e são válidos
      if (src && Array.isArray(src.data) && src.type) {
        
        // Converte o array `src.data` em Uint8Array e cria um Blob com o tipo correto
        const blob = new Blob([Uint8Array.from(src.data)], { type: src.type });
        const imageUrl = URL.createObjectURL(blob);
        
        // Define a pré-visualização da imagem
        setImagePreview(imageUrl);
        
      } else {
        console.error('Formato de dados da imagem inválido ou incompleto');
      }
    } else {
      console.error('Erro ao buscar o ícone:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao conectar com o backend:', error);
  }
};

// Carrega os IDs de ícones ao montar o componente
useEffect(() => {
  fetchIconIds();
}, []);




  useEffect(() => {
    if (action === 'delete' && selectedId) {
      fetchIconById(selectedId); // Busca a imagem correspondente ao ID selecionado
    } else {
      setImagePreview(null); // Limpa a visualização se não for deletar
    }
  }, [action, selectedId]);

  const handleChange = (e) => {
    const { name, type } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, src: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: e.target.value });
    }
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setSelectedId(''); // Reseta a seleção ao mudar a ação
    setImagePreview(null); // Limpa a visualização da imagem ao mudar a ação
    setFormData({ id: '', src: null, newId: '' }); // Limpa o formulário ao mudar a ação
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    if (action === 'add') {
      formDataToSend.append('icon_id', formData.id);
      formDataToSend.append('src', formData.src); // Somente para adicionar
    } else if (action === 'modify') {
      formDataToSend.append('icon_id', selectedId); // ID existente para modificar
      formDataToSend.append('src', formData.src); // Nova imagem
    } else {
      formDataToSend.append('icon_id', selectedId); // Para deletar
    }

    try {
      const url = `http://localhost:5000/api/icons/${action === 'delete' ? `delete/${selectedId}` : (action === 'add' ? 'add' : 'modify')}`;
      const method = action === 'delete' ? 'DELETE' : (action === 'add' ? 'POST' : 'PUT');

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        alert(`Ícone ${action === 'delete' ? 'deletado' : action === 'modify' ? 'modificado' : 'adicionado'} com sucesso!`);
        fetchIconIds(); // Atualiza a lista de IDs após a ação
        setImagePreview(null); // Limpa a visualização após a ação
        setFormData({ id: '', src: null, newId: '' }); // Limpa o formulário após a ação
        setSelectedId(''); // Reseta a seleção do dropdown
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
      <div className='icon-editor-label-title'>
        <h2 className="icon-editor-title">Icon Editor</h2>
      </div>

      <select onChange={handleActionChange} value={action}>
        <option value="add">Adicionar Ícone</option>
        <option value="modify">Modificar Ícone</option>
        <option value="delete">Deletar Ícone</option>
      </select>

      <form className="icon-editor-form" onSubmit={handleSubmit}>
        {action === 'add' && (
          <>
            <label className="icon-editor-label">ID do Ícone:</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Digite o ID do ícone"
              className="icon-editor-input"
              required // Adicionado para garantir que o ID é fornecido
            />
            <label className="icon-editor-label">Carregar Imagem:</label>
            <input
              type="file"
              name="src"
              onChange={handleChange}
              accept="image/*"
              className="icon-editor-input-file"
              required // Adicionado para garantir que a imagem é fornecida
            />
          </>
        )}

        {action === 'delete' && (
          <>
            <label className="icon-editor-label">Selecionar ID do Ícone:</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
              <option value="">Selecione um ID</option>
              {iconIds.map((icon) => (
                <option key={icon.id} value={icon.id}>{icon.id}</option>
              ))}

            </select>
            {selectedId && (
              <div className="image-preview-container">
                <h3>Imagem a ser deletada:</h3>
                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
              </div>
            )}
          </>
        )}

        {action === 'modify' && (
          <>
            <label className="icon-editor-label">Selecionar ID do Ícone:</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
              <option value="">Selecione um ID</option>
              {iconIds.map((icon) => (
                <option key={icon.id} value={icon.id}>{icon.id}</option>
              ))}

            </select>

            <label className="icon-editor-label">Upload da Nova Imagem:</label>
            <input
              type="file"
              name="src"
              onChange={handleChange}
              accept="image/*"
              className="icon-editor-input-file"
            />
          </>
        )}

        <button type="submit" className="icon-editor-button">{action === 'delete' ? 'Deletar Ícone' : 'Salvar Ícone'}</button>
      </form>
    </div>
  );
};

export default IconEditor;
