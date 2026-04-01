const express = require('express');
const cors = require('cors');
require('dotenv').config();
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
    res.send('API E-Menu is running');
});

// Chạy server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
