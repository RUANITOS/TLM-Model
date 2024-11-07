import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [action, setAction] = useState('add');
  const { addAlert } = useAlertas();
  // Função para obter o valor de um cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    // Verificar e popular os campos com os valores dos cookies
    const positionRow = getCookie('position_row');
    const positionCol = getCookie('position_col');

    if (positionRow) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        posicao_linha: positionRow,
      }));
    }

    if (positionCol) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        posicao_coluna: positionCol,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setMosaicId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/mosaics/add', formData);
      addAlert('Mosaico adicionado com sucesso!', 'success');
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao adicionar mosaico:', error);
      addAlert('Erro ao adicionar mosaico.', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!mosaicId) {
      addAlert('Por favor, forneça um ID de mosaico para modificar.','error');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/mosaics/modify/${mosaicId}`, formData);
      addAlert('Mosaico modificado com sucesso!','success');
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao modificar mosaico:', error);
      addAlert('Erro ao modificar mosaico.','error');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!mosaicId) {
      addAlert('Por favor, forneça um ID de mosaico para deletar.','error');
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/mosaics/delete/${mosaicId}`);
      addAlert('Mosaico deletado com sucesso!','success');
    } catch (error) {
      console.error('Erro ao deletar mosaico:', error);
      addAlert('Erro ao deletar mosaico.','error');
    }
  };

  return (
    <div className="icon-editor-container">
      <Header />
      <div className="icon-editor-label-title">
        <h2 className="icon-editor-title">Editor de Mosaicos</h2>
      </div>



      <form className="icon-editor-form" onSubmit={action === 'add' ? handleSubmit : handleUpdate}>
        {action === 'add' && (
          <>
            <select className="select" onChange={handleActionChange} value={action}>
              <option value="add">Adicionar Mosaico</option>
              <option value="modify">Modificar Mosaico</option>
            </select>
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
                onChange={handleChange}
                className="icon-editor-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">ID Ícone:</label>
              <input
                type="number"
                name="id_icone"
                value={formData.id_icone}
                onChange={handleChange}
                className="icon-editor-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Descrição Completa:</label>
              <textarea
                name="descricao_completa"
                value={formData.descricao_completa}
                onChange={handleChange}
                className="icon-editor-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Descrição Resumida:</label>
              <textarea
                name="descricao_resumida"
                value={formData.descricao_resumida}
                onChange={handleChange}
                className="icon-editor-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Tipo de Conteúdo:</label>
              <input
                type="number"
                name="conteudo_efetivo"
                value={formData.conteudo_efetivo}
                onChange={handleChange}
                className="icon-editor-input"
                placeholder='0=url 1=foto 2=texto 3=video 4=link genérico'
                required
              />
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
            <button type="submit" className="icon-editor-button">Adicionar</button>
          </>
        )}

        {action === 'modify' && (
          <>
            <select className="select" onChange={handleActionChange} value={action}>
              <option value="add">Adicionar Mosaico</option>
              <option value="modify">Modificar Mosaico</option>
            </select>
            <div className="form-group">
              <label className="icon-editor-label">ID do Mosaico:</label>
              <input
                type="text"
                value={mosaicId}
                onChange={(e) => setMosaicId(e.target.value)}
                className="icon-editor-input"
                placeholder="Digite o ID do mosaico a ser alterado"
                required
              />
            </div>
            {/* Campos de Modificação */}
            <div className="form-group">
              <label className="icon-editor-label">Posição Linha:</label>
              <input
                type="number"
                name="posicao_linha"
                value={formData.posicao_linha}
                onChange={handleChange}
                className="icon-editor-input"
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
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Título Célula:</label>
              <input
                type="text"
                name="titulo_celula"
                value={formData.titulo_celula}
                onChange={handleChange}
                className="icon-editor-input"
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">ID Ícone:</label>
              <input
                type="number"
                name="id_icone"
                value={formData.id_icone}
                onChange={handleChange}
                className="icon-editor-input"
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Descrição Completa:</label>
              <textarea
                name="descricao_completa"
                value={formData.descricao_completa}
                onChange={handleChange}
                className="icon-editor-input"
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Descrição Resumida:</label>
              <textarea
                name="descricao_resumida"
                value={formData.descricao_resumida}
                onChange={handleChange}
                className="icon-editor-input"
              />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">Tipo de Conteúdo:</label>
              <input
                type="number"
                name="conteudo_efetivo"
                value={formData.conteudo_efetivo}
                onChange={handleChange}
                className="icon-editor-input"
                placeholder='0=url 1=foto 2=texto 3=video 4=link genérico'
              />
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
            <button type="submit" className="icon-editor-button">Modificar</button>
            <button type="button" className="icon-editor-button delete-button" onClick={handleDelete}>
              Deletar
            </button>

          </>

        )}
        <Link to="/TLM-Producao">
          <button className="icon-editor-button">Voltar para o mosaico</button>
        </Link>
      </form>

    </div>
  );
}

export default MosaicForm;
