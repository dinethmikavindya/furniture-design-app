const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const projectsRoutes = require('./routes/projects.routes');
const furnitureRoutes = require('./routes/furniture.routes');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/', (req, res) => {
    res.json({ message: 'API Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/furniture', furnitureRoutes);

app.listen(PORT, () => {
    console.log('Server started on port 3001');
});