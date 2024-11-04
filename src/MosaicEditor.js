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
    newId: '',
    nova_implementacao: '', // Campo para a implementação
  });
  const [mosaicIds, setMosaicIds] = useState([]);
  const [iconList, setIconList] = useState([]); // Lista de ícones
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

  // Fetch all icons
  const fetchIcons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/icons');
      if (response.ok) {
        const data = await response.json();
        setIconList(data);
      } else {
        console.error('Erro ao buscar ícones');
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

        // Busca a imagem da tabela icons com base no codigo_id_icone
        const iconResponse = await fetch(`http://localhost:5000/api/icons/${codigo_id_icone}`);
        if (iconResponse.ok) {
          const iconData = await iconResponse.json();
          const blob = new Blob([Uint8Array.from(iconData.src.data)], { type: iconData.src.type });
          const imageUrl = URL.createObjectURL(blob);
          setImagePreview(imageUrl);
        } else {
          console.error('Erro ao buscar ícone:', iconResponse.statusText);
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
    fetchIcons(); // Chama a função para buscar ícones ao carregar o componente
  }, []);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      newId: '', 
      nova_implementacao: '', // Limpar o novo campo
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
          newId: '', 
          nova_implementacao: '', // Limpar o novo campo
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
      try {
        // Busca o ID do ícone na API
        const iconResponse = await fetch(`http://localhost:5000/api/icons/${formData.codigo_id_icone}`);
        if (iconResponse.ok) {
          const iconData = await iconResponse.json();
          formDataToSend.append('codigo_id_icone', iconData.codigo_id_icone); // Adiciona o código do ícone
        } else {
          throw new Error('Ícone não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar ícone:', error);
        return; // Para o envio se houver erro
      }

      formDataToSend.append('id_implem', formData.id_implem);
      formDataToSend.append('descricao_completa', formData.descricao_completa);
      formDataToSend.append('descricao_resumida', formData.descricao_resumida);
      formDataToSend.append('posicao_linha', formData.posicao_linha);
      formDataToSend.append('posicao_coluna', formData.posicao_coluna);
      formDataToSend.append('conteudo_efetivo', formData.conteudo_efetivo);
      formDataToSend.append('nova_implementacao', formData.nova_implementacao); // Adicionando o novo campo
      formDataToSend.append('dt_criacao', new Date().toISOString());
    } else if (action === 'modify') {
      formDataToSend.append('id_implem', selectedId);
      formDataToSend.append('descricao_completa', formData.descricao_completa);
      formDataToSend.append('descricao_resumida', formData.descricao_resumida);
      formDataToSend.append('posicao_linha', formData.posicao_linha);
      formDataToSend.append('posicao_coluna', formData.posicao_coluna);
      formDataToSend.append('codigo_id_icone', formData.codigo_id_icone);
      formDataToSend.append('conteudo_efetivo', formData.conteudo_efetivo);
      formDataToSend.append('nova_implementacao', formData.nova_implementacao); // Adicionando o novo campo
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
          newId: '', 
          nova_implementacao: '', // Limpar o novo campo
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
    <div className="mosaic-editor">
      <Header />
      <h2>{action === 'add' ? 'Adicionar Mosaico' : 'Modificar Mosaico'}</h2>
      <select value={action} onChange={handleActionChange}>
        <option value="add">Adicionar</option>
        <option value="modify">Modificar</option>
      </select>

      {action === 'modify' && (
        <select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); fetchMosaicById(e.target.value); }}>
          <option value="">Selecione um mosaico</option>
          {mosaicIds.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      )}

      {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

      <form onSubmit={handleSubmit} className="mosaic-editor-form">
        <label>
          ID da Implementação:
          <input type="text" name="id_implem" value={formData.id_implem} onChange={handleChange} />
        </label>
        <label>
          Descrição Completa:
          <input type="text" name="descricao_completa" value={formData.descricao_completa} onChange={handleChange} />
        </label>
        <label>
          Descrição Resumida:
          <input type="text" name="descricao_resumida" value={formData.descricao_resumida} onChange={handleChange} />
        </label>
        <label>
          Posição Linha:
          <input type="text" name="posicao_linha" value={formData.posicao_linha} onChange={handleChange} />
        </label>
        <label>
          Posição Coluna:
          <input type="text" name="posicao_coluna" value={formData.posicao_coluna} onChange={handleChange} />
        </label>
        <label>
          Código ID Ícone:
          <select name="codigo_id_icone" value={formData.codigo_id_icone} onChange={handleChange}>
            <option value="">Selecione um ícone</option>
            {iconList.map((icon) => (
              <option key={icon.id} value={icon.codigo_id_icone}>{icon.nome}</option>
            ))}
          </select>
        </label>
        <label>
          Conteúdo Efetivo:
          <input type="text" name="conteudo_efetivo" value={formData.conteudo_efetivo} onChange={handleChange} />
        </label>
        <label>
          Nova Implementação:
          <input type="number" name="nova_implementacao" value={formData.nova_implementacao} onChange={handleChange} min="0" max="1000" />
        </label>
        <button type="submit">Salvar</button>
        {action === 'modify' && <button type="button" onClick={handleDelete}>Deletar</button>}
      </form>
    </div>
  );
};

export default MosaicEditor;
