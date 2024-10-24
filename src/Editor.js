import React, { useState } from 'react';
import './styles/Editor.css'; // Novo nome para o arquivo de estilo

const IconEditor = () => {
  const [formData, setFormData] = useState({
    id: '',
    src: null, // Imagem como BLOB
    placement: '',
    hovertext: '',
    associatedIcons: false, // Checkbox
    modalTitle: '',
    modalContent: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, src: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparando os dados para enviar ao backend
    const formDataToSend = new FormData();
    formDataToSend.append('icon_id', formData.id);
    formDataToSend.append('src', formData.src); // Certifique-se de que formData.src seja um arquivo
    formDataToSend.append('placement', formData.placement);
    formDataToSend.append('hovertext', formData.hovertext);
    formDataToSend.append('associated_icons', formData.associatedIcons); // Envie como booleano
    formDataToSend.append('modal_title', formData.modalTitle || '');
    formDataToSend.append('modal_content', formData.modalContent || '');

    try {
      // Enviando os dados ao backend via POST
      const response = await fetch('http://localhost:5000/api/icons', {
        method: 'POST',
        body: formDataToSend,
      });

      // Tratamento da resposta do backend
      if (response.ok) {
        const result = await response.json();
        console.log('Ícone adicionado com sucesso:', result);
      } else {
        const error = await response.text(); // Capture o texto do erro
        console.error('Erro ao enviar os dados:', error);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  return (
    <div className="icon-editor-container">
      <h2 className="icon-editor-title">Icon Editor</h2>
      <form className="icon-editor-form" onSubmit={handleSubmit}>
        <label className="icon-editor-label">ID do Ícone:</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="Digite o ID do ícone"
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

        <label className="icon-editor-label">Posição:</label>
        <input
          type="text"
          name="placement"
          value={formData.placement}
          onChange={handleChange}
          placeholder="Posição (e.g., square-1-1)"
          className="icon-editor-input"
        />

        <label className="icon-editor-label">Texto de Hover:</label>
        <input
          type="text"
          name="hovertext"
          value={formData.hovertext}
          onChange={handleChange}
          placeholder="Texto exibido ao passar o mouse"
          className="icon-editor-input"
        />

        <label className="icon-editor-checkbox-label">
          <input
            type="checkbox"
            name="associatedIcons"
            checked={formData.associatedIcons}
            onChange={handleChange}
            className="icon-editor-checkbox"
          />
          Ícone Associado
        </label>

        <label className="icon-editor-label">Título do Modal:</label>
        <input
          type="text"
          name="modalTitle"
          value={formData.modalTitle}
          onChange={handleChange}
          placeholder="Título do Modal"
          className="icon-editor-input"
        />

        <label className="icon-editor-label">Conteúdo do Modal:</label>
        <textarea
          name="modalContent"
          value={formData.modalContent}
          onChange={handleChange}
          placeholder="Conteúdo do Modal"
          className="icon-editor-textarea"
        />

        <button type="submit" className="icon-editor-button">Salvar Ícone</button>
      </form>
    </div>
  );
};

export default IconEditor;
