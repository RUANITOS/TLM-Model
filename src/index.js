import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import Grid from './Grid';
//import Login from './Login';
import Editor from './Editor';
import MosaicForm from './mosaicEditor';
const App = () => {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  //const handleLogin = () => {setIsLoggedIn(true);};
  //element={isLoggedIn ? <Grid /> : <Login onLogin={handleLogin}
  return (
    <Router>
      <Routes>
        <Route path="/TLM-Producao" element={<Grid />} />
        <Route path="/TLM-Producao/Editor" element={<Editor />} />
        <Route path="/TLM-Producao/Mosaiceditor" element={<MosaicForm />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
