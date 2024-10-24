// dbConfig.js
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false, // Defina como true se estiver usando Azure
    enableArithAbort: true,
  },
};

const connectToDatabase = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Conectado ao SQL Server com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
};

module.exports = { sql, connectToDatabase };
