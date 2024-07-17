const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = "mongodb+srv://mobileSystem:LXsfE99AtQ4zP2Ik@cluster0.xpkslah.mongodb.net/mobileDB?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    //await client.connect();
    //console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

// Database and Collection
const db = client.db('mobileDB');
const userCollection = db.collection('user');
const transactionCollection = db.collection('transaction');

// Routes

// Add a new user
app.post('/user', async (req, res) => {
  try {
    const newUser = req.body;
    const hashedPIN = await bcrypt.hash(newUser.pin, 10);
    newUser.pin = hashedPIN; 
    const result = await userCollection.insertOne(newUser);
    res.status(201).json({ message: 'User added successfully', newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Get all users
app.get('/user', async (req, res) => {
  try {
    const users = await userCollection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
app.get('/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Add a new transaction
app.post('/transaction', async (req, res) => {
  try {
    const newTransaction = req.body;
    const result = await transactionCollection.insertOne(newTransaction);
    res.status(201).json({ message: 'Transaction added successfully', newTransaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Get all transactions
app.get('/transaction', async (req, res) => {
  try {
    const transactions = await transactionCollection.find().toArray();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Mobile Financial System is running');
});

// Start server
app.listen(port, () => {
  console.log(`Mobile Financial System is running on port : ${port}`);
});
