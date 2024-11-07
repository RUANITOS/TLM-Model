import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import Grid from './Grid';
import Editor from './Editor';
import MosaicForm from './mosaicEditor';
import { AlertasProvider } from './contexts/AlertasContext'; // Importe o provider de alertas

const App = () => {
  return (
    <AlertasProvider> {/* Envolva o Router com o AlertasProvider */}
      <Router>
        <Routes>
          <Route path="/TLM-Producao" element={<Grid />} />
          <Route path="/TLM-Producao/Editor" element={<Editor />} />
          <Route path="/TLM-Producao/Mosaiceditor" element={<MosaicForm />} />
        </Routes>
      </Router>
    </AlertasProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
