import React, { useState } from 'react';
import './styles/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulação de autenticação simples
    if (username === '' && password === '') {
      onLogin(); // Chama a função de login bem-sucedido
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <img className="logosss"src={process.env.PUBLIC_URL + '/assets/logonova.png'} alt="Logo" /> {/* Usando PUBLIC_URL para acessar a pasta public */}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
          />
        </div>
        <div className="input-group">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
