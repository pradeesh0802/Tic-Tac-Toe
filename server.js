const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/db');

const app = express();
const PORT = 5001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(bodyParser.json());

app.post('/api/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Password and Confirm Password do not match' });
  }

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
