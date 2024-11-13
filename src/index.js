import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import Grid from './Grid';
import Editor from './Editor';
import MosaicForm from './mosaicEditor';
import Login from './Login'; // Importe o componente Login
import { AlertasProvider } from './contexts/AlertasContext'; // Importe o provider de alertas

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true); // Define autenticação como verdadeira ao logar
  };

  return (
    <AlertasProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          {isAuthenticated ? (
            <>
              <Route path="/TLM-Producao" element={<Grid />} />
              <Route path="/TLM-Producao/Editor" element={<Editor />} />
              <Route path="/TLM-Producao/Mosaiceditor" element={<MosaicForm />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" />} /> // Redireciona para login se não autenticado
          )}
        </Routes>
      </Router>
    </AlertasProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
