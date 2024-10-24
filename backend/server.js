// server.js
const express = require('express');
const { sql, connectToDatabase } = require('./dbConfig');

const app = express();
const PORT = 3000;

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Conectar ao banco de dados
connectToDatabase();

// Rota para salvar o mockData
app.post('/save-mockdata', async (req, res) => {
  const mockData = req.body; // Recebe o mockData enviado no corpo da requisição
  
  try {
    const transaction = new sql.Transaction();
    await transaction.begin();

    // Iterar pelos ícones no mockData e salvar cada um
    for (const icon of mockData) {
      const request = new sql.Request(transaction);
      await request.query(
        `INSERT INTO Icons (id, src, placement, hovertext) 
         VALUES ('${icon.id}', '${icon.src}', '${icon.placement}', '${icon.hovertext}')`
      );

      // Se tiver ícones associados, insira também
      for (const associatedIcon of icon.associatedIcons) {
        const associatedRequest = new sql.Request(transaction);
        await associatedRequest.query(
          `INSERT INTO Icons (id, src, placement, hovertext, parentId) 
           VALUES ('${associatedIcon.id}', '${associatedIcon.src}', '${associatedIcon.placement}', '${associatedIcon.hovertext}', '${icon.id}')`
        );
      }
    }

    await transaction.commit();
    res.status(200).send('MockData salvo com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar o mockData:', err);
    res.status(500).send('Erro ao salvar o mockData.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
