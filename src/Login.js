import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [implementation, setImplementation] = useState('0'); // Estado para a implementação selecionada
  const [implementations, setImplementations] = useState([]); // Estado para a lista de implementações
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para controle de carregamento
  const navigate = useNavigate();

  // Fetch para buscar implementações do backend
  useEffect(() => {
    const fetchImplementations = async () => {
      setIsLoading(true); // Inicia o carregamento
      try {
        const response = await fetch('https://apimosaic-c3aba7a2acfnh6fd.canadacentral-01.azurewebsites.net/api/implementations/namesandids/3');
        const data = await response.json();

        if (response.ok) {
          setImplementations(data); // Supondo que o backend retorna um array de implementações
        } else {
          console.error('Erro ao buscar implementações:', data.message);
        }
      } catch (error) {
        console.error('Erro ao buscar implementações:', error);
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };

    fetchImplementations();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reseta o estado de erro

    try {
      const response = await fetch('https://apimosaic-c3aba7a2acfnh6fd.canadacentral-01.azurewebsites.net/api/users/login', {
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
          {isLoading ? (
            <p className='loading'>Carregando implementações...</p> // Exibe a mensagem de carregamento
          ) : (
            <select
              className="select-imp"
              value={implementation}
              onChange={(e) => setImplementation(e.target.value)}
            >
              {implementations.map((imp) => (
                <option key={imp.id_implem} value={imp.id_implem}>
                  {imp.nome_implementacao}
                </option>
              ))}
            </select>
          )}
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
      <a>Versão BETA - 0.4</a>
    </div>
  );
};

export default Login;
