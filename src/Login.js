import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [implementation, setImplementation] = useState('0'); // Estado para a implementação selecionada
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reseta o estado de erro
  
    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        onLogin(data.user); // Executa a ação de login bem-sucedido
        document.cookie = `id_implem=${implementation}; path=/;`;
        navigate('/dashboard'); // Redireciona para outra página (exemplo: Dashboard)
      } else {
        setError(data.message || 'Erro desconhecido');
      }
    } catch (error) {
      setError('Erro ao tentar realizar o login. Tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <img className="logosss" src={process.env.PUBLIC_URL + '/assets/logonova.png'} alt="Logo" />
      <form onSubmit={handleLogin} className="main-div">
        <h2 className="panel h2">Identificação do usuário</h2>
        <p className="panel p">Insira seu Usuário e senha</p>
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
            required
          />
        </div>
        <div className="input-group">
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />
        </div>
        <div className="implementacao">
          <label className="panel">Implementação</label>
          <select
            className="select-imp"
            value={implementation}
            onChange={(e) => setImplementation(e.target.value)}
          >
            <option value="0">Implementação 0</option>
            <option value="1">Implementação 1</option>
            <option value="2">Implementação 2</option>
            <option value="3">Implementação 3</option>
            <option value="4">Implementação 4</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>} 
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
