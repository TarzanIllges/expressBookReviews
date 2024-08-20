const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

app.use(express.json());

// Task 10: Get list of books using async/await with Axios
app.get('/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Task 11: Get book details by ISBN using async/await with Axios
app.get('/books/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/api/books/isbn/${isbn}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving book with ISBN ${isbn}` });
  }
});

// Task 12: Get book details by author using async/await with Axios
app.get('/books/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/api/books/author/${author}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving books by author ${author}` });
  }
});

// Task 13: Get book details by title using async/await with Axios
app.get('/books/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/api/books/title/${title}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving books with title ${title}` });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
