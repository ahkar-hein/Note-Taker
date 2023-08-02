// import required package
const express = require('express');
const path = require('path');
const fs = require('fs');

// Declare variable for port 3001 or process.env.PORT for heroku
const PORT = process.env.PORT || 3001;

const app = express();
// express middleway
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// get route for index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// get route for notes.html
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// dummy array for user input (id, titles and text)
let notes = [];

// Read teh db.JSON file by using fs.readfile
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

// get route for /api/notes
app.get('/api/notes', (req, res) => res.json(notes));

// post route for /api/notes
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
  
    // checking user input for title and text
    if (!title || !text) {
      return res.status(400).json({ error: 'Title and text fields are required.' });
    }

    const newNote = {
      id: Date.now().toString(), // generate unique id for the note
      title,
      text,
    };
    // putting id, title and text into dummy array
    notes.push(newNote);

    // inserting user input data into db.JSON by using fs.writefile and JSON.stringify
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
        if (err) {
          console.error('Error writing db.json:', err);
          return res.status(500).json({ error: 'Failed to save the note.' });
        }
    
        res.status(201).json(newNote);
      });
});
// note delete function
app.delete('/api/notes/:id', (req, res) => {
    // Get the ID of the note to be deleted from the request parameters
    const noteId = req.params.id;
  // Filter out the note with the given ID and update the 'notes' array
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

  app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`));