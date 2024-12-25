/*
Integrantes:
Alejandro Marin Hoyos - 2259353-3743
Yessica Fernanda Villa Nuñez - 2266301-3743
Manuel Antonio Vidales Duran - 2155481-3743
*/

// Importación de las librerías necesarias
const express = require('express'); // Framework para construir aplicaciones web y APIs en Node.js.
const path = require('path'); // Módulo para manejar y manipular rutas de archivos y directorios.
const MinizincWrapper = require('./minizincWrapper'); // Importa una clase personalizada para interactuar con MiniZinc.

// Creación de la aplicación Express
const app = express(); // Inicializa la aplicación Express.
const port = process.env.PORT || 3000; // Define el puerto donde se ejecutará el servidor. Si no está definido en las variables de entorno, usa el puerto 3000 por defecto.
const minizinc = new MinizincWrapper(); // Crea una instancia de la clase MinizincWrapper.

// Middleware
app.use(express.json()); // Middleware que permite procesar el cuerpo de solicitudes en formato JSON.
app.use(express.static('public')); // Sirve archivos estáticos desde el directorio 'public'.

// Definición de rutas

/**
 * Ruta raíz ('/').
 * Sirve el archivo HTML principal ubicado en el directorio 'public'.
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Responde con el archivo `index.html`.
});

/**
 * Ruta POST para resolver un modelo MiniZinc.
 * Recibe un objeto JSON con los datos necesarios para ejecutar el modelo.
 * Devuelve el resultado del modelo o un mensaje de error si ocurre algún problema.
 */
app.post('/solve', async (req, res) => {
    try {
        const modelPath = path.join(__dirname, '../models/ubicacion.mzn'); // Ruta al archivo del modelo MiniZinc.
        const result = await minizinc.solve(modelPath, req.body); // Llama al método solve con los datos enviados en el cuerpo de la solicitud.
        res.json(result); // Devuelve el resultado como respuesta JSON.
    } catch (error) {
        res.status(500).json({ error: error.message }); // Devuelve un mensaje de error con un código de estado 500.
    }
});

// Crear el directorio temporal si no existe

/**
 * Crea un directorio llamado `temp` para almacenar archivos temporales.
 * Esto asegura que exista antes de que se utilice en otros procesos.
 */
const tempDir = path.join(__dirname, '../temp'); // Ruta al directorio temporal.
if (!require('fs').existsSync(tempDir)) {
    require('fs').mkdirSync(tempDir); // Crea el directorio si no existe.
}

// Inicia el servidor

/**
 * Inicia el servidor en el puerto definido.
 * Muestra un mensaje en la consola indicando que el servidor está corriendo.
 */
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`); // Mensaje de confirmación en la consola.
});
