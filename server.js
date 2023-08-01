const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

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
      id: Date.now().toString(),
      title,
      text,
    };
    notes.push(newNote);
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
        if (err) {
          console.error('Error writing db.json:', err);
          return res.status(500).json({ error: 'Failed to save the note.' });
        }
    
        res.status(201).json(newNote);
      });
});
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    notes = notes.filter((note) => note.id !== noteId);
  
    // Save the updated notes to db.json
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error('Error writing db.json:', err);
        return res.status(500).json({ error: 'Failed to delete the note.' });
      }
  
      res.sendStatus(204);
    });
  });