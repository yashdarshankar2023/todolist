const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb+srv://yashdarshankar:Yash%401001@cluster0.gto09ok.mongodb.net/mernstack?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });
const db = client.db('mydatabase');
const col = db.collection('todolist');


async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();

app.get('/api/todos', async (req, res) => {
  try {

    const todos = await col.find().toArray();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/todos', async (req, res) => {
  const { text, checked } = req.body;
  try {

    const result = await col.insertOne({ text, checked });
    const newTodo = result.ops[0];
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.delete('/api/todos/:id', async (req, res) => {
  const todoId = req.params.id;

  if (!ObjectId.isValid(todoId)) {
    return res.status(400).json({ error: 'Invalid ObjectId' });
  }

  try {

    console.log('Deleting todo with id:', todoId);
    const result = await col.deleteOne({ _id: new ObjectId(todoId) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Todo deleted successfully' });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
