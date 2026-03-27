// Load env variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const aiRoutes = require('./src/routes/ai.routes');
const connecteDB = require('./src/config/db');
const app = express();

// Use PORT from env or fallback
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// DB connection
connecteDB();

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use('/api/auth', authRoutes);
app.use('/api/ai',aiRoutes)

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});