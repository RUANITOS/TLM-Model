import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import Grid from './Grid';
import Login from './Login';
import Editor from './Editor';
import MosaicEditor from './MosaicEditor';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/TLM-Producao" element={isLoggedIn ? <Grid /> : <Login onLogin={handleLogin} />} />
        <Route path="/TLM-Producao/Editor" element={<Editor />} />
        <Route path="/TLM-Producao/MosaicEditor" element={<MosaicEditor />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
