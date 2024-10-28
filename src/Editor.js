import React, { useState, useEffect } from 'react';
import './styles/Editor.css'; // Novo nome para o arquivo de estilo

const IconEditor = () => {
  const [formData, setFormData] = useState({
    id: '',
    src: null, // Imagem como BLOB
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
        const { src } = await response.json(); // Assume que o endpoint retorna um objeto com a propriedade 'src'
        const blob = new Blob([new Uint8Array(src.data)], { type: src.mimetype }); // Cria um Blob a partir dos dados
        const imageUrl = URL.createObjectURL(blob); // Gera uma URL a partir do Blob
        setImagePreview(imageUrl); // Atualiza o estado da visualização da imagem
      } else {
        console.error('Erro ao buscar o ícone:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  useEffect(() => {
    fetchIconIds(); // Busca os IDs ao montar o componente
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
    setFormData({ id: '', src: null }); // Limpa o formulário ao mudar a ação
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    if (action === 'add') {
      formDataToSend.append('icon_id', formData.id);
      formDataToSend.append('src', formData.src); // Somente para adicionar
    } else {
      formDataToSend.append('icon_id', selectedId); // Para modificar ou deletar
    }
  
    try {
      // Use a rota correta para cada ação
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
        setFormData({ id: '', src: null }); // Limpa o formulário após a ação
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
            <label className="icon-editor-label">Upload de Imagem (BLOB):</label>
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

        {action === 'delete' && imagePreview && (
          <div className="image-preview-container">
            <h3>Imagem a ser deletada:</h3>
            <img src={imagePreview} alt="Preview" className="image-preview" />
          </div>
        )}

        {action !== 'add' && (
          <>
            <label className="icon-editor-label">Selecionar ID do Ícone:</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
              <option value="">Selecione um ID</option>
              {iconIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </>
        )}

        <button type="submit" className="icon-editor-button">{action === 'delete' ? 'Deletar Ícone' : 'Salvar Ícone'}</button>
      </form>
    </div>
  );
};

export default IconEditor;
