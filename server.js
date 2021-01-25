const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

//Connect Database
connectDB();

app.get('/', (req, res) => res.json({ msg: "Welcome to Diagon Diaries API!!!" }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/books', require('./routes/books'));
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));