const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./src/db');

const app = express();
const PORT = 5001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'form', 'build')));

app.post('/api/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;

  const insertUserQuery = 'INSERT INTO users (username, password, confirmPassword, active) VALUES (?, ?, ?, "Y")';
  db.query(insertUserQuery, [username, password, confirmPassword], (err) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ data: { message: 'User registered successfully' }});
  });
});

app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;

  const checkUserQuery = 'SELECT * FROM users WHERE username = ? AND active = "Y"';
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res.status(200).json({ exists: true });
    }

    res.status(200).json({ exists: false });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const loginQuery = 'SELECT * FROM users WHERE username = ? AND password = ? AND active = "Y"';
  db.query(loginQuery, [username, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful'});
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'form', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
