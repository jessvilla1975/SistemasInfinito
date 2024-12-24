const express = require('express');

const path = require('path');
const MinizincWrapper = require('./minizincWrapper');

const app = express();
const port = process.env.PORT || 3000;
const minizinc = new MinizincWrapper();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/solve', async (req, res) => {
    try {
        const modelPath = path.join(__dirname, '../models/ubicacion.mzn');
        const result = await minizinc.solve(modelPath, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear directorio temporal si no existe
const tempDir = path.join(__dirname, '../temp');
if (!require('fs').existsSync(tempDir)) {
    require('fs').mkdirSync(tempDir);
}

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});