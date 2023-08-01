const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`));

let notes = [];

fs.readFile('db/db.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading db.json:', err);
  } else {
    try {
      notes = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing db.json:', parseError);
    }
  }
});

app.get('/api/notes', (req, res) => res.json(notes));

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
  
    if (!title || !text) {
      return res.status(400).json({ error: 'Title and text fields are required.' });
    }
  
    const newNote = {
      title,
      text,
    };
  
    notes.push(newNote);

});