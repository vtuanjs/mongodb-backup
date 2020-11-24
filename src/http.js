const express = require('express');
const app = express();
const config = require('./config');
const backupDB = require('./backup');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function handleBackup(token, res) {
  if (!config.token) {
    return res.status(500).json({
      message: "Method is disabled, please set your system' token",
    });
  }

  try {
    if (typeof token == 'string' && token === config.token) {
      backupDB();

      return res.status(200).json({
        message: 'Process starting...',
      });
    }

    return res.status(403).json({
      message: 'Invalid token',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unknown error',
      details: JSON.stringify(error),
    });
  }
}

app.get('/', (req, res) => {
  const token = req.query.token;
  return handleBackup(token, res);
});

app.post('/', (req, res) => {
  const token = req.body.token;

  return handleBackup(token, res);
});

module.exports = app;
