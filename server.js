const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => res.json({ msg: "Welcome to Diagon Diaries API!!!" }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/books', require('./routes/books'));

app.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));