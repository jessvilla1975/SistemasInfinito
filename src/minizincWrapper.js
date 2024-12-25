/*
Integrantes:
Alejandro Marin Hoyos - 2259353-3743
Yessica Fernanda Villa Nuñez - 2266301-3743
Manuel Antonio Vidales Duran - 2155481-3743
*/

// Importación de módulos necesarios
const { exec } = require('child_process'); // Para ejecutar comandos en la terminal.
const path = require('path'); // Para manejar rutas de archivos y directorios.
const fs = require('fs').promises; // Para operaciones asíncronas con el sistema de archivos.

// Clase MinizincWrapper: Sirve como contenedor para interactuar con MiniZinc.
class MinizincWrapper {
    constructor() {
        // Al crear una instancia de esta clase, verifica que MiniZinc esté instalado.
        this.checkMinizincInstallation();
    }

    /**
     * Verifica si MiniZinc está instalado y disponible en el PATH del sistema.
     * Si no lo está, imprime un mensaje de error y finaliza el programa.
     */
    checkMinizincInstallation() {
        exec('minizinc --version', (error) => {
            if (error) {
                console.error('Error: MiniZinc no está instalado o no está en el PATH');
                process.exit(1); // Finaliza el proceso con un código de error.
            }
        });
    }

    /**
     * Resuelve un modelo MiniZinc utilizando los datos proporcionados.
     * 
     * @param {string} modelPath - Ruta del archivo del modelo MiniZinc (.mzn).
     * @param {Object} data - Datos necesarios para resolver el modelo.
     * @returns {Promise<Object>} - Resultado parseado de MiniZinc.
     */
    async solve(modelPath, data) {
        // Rutas temporales para los archivos .dzn (datos) y de salida.
        const tempDataPath = path.join(__dirname, '../temp', `data_${Date.now()}.dzn`);
        const tempOutputPath = path.join(__dirname, '../temp', `output_${Date.now()}.txt`);
        const dznContent = this.convertToDzn(data); // Convierte los datos al formato .dzn.

        try {
            // Crea el directorio temporal si no existe.
            const tempDir = path.join(__dirname, '../temp');
            await fs.mkdir(tempDir, { recursive: true });
            await fs.writeFile(tempDataPath, dznContent); // Escribe los datos en un archivo .dzn.

            // Ejecuta MiniZinc y procesa la salida.
            return new Promise((resolve, reject) => {
                exec(`minizinc --output-mode json ${modelPath} ${tempDataPath}`, async (error, stdout, stderr) => {
                    console.log("Raw MiniZinc output:", stdout); 
                    fs.unlink(tempDataPath).catch(console.error); // Borra el archivo temporal de datos.

                    if (error) {
                        reject(new Error(`Error al ejecutar MiniZinc: ${stderr || error.message}`));
                        return;
                    }

                    try {
                        console.log("Salida de MiniZinc:", stdout);
                        const jsonOutput = this.extractJson(stdout); // Extrae el JSON de la salida.
                        await fs.writeFile(tempOutputPath, jsonOutput); // Escribe la salida JSON en un archivo temporal.

                        const result = this.parseOutput(jsonOutput, data); // Analiza la salida.
                        resolve(result); // Retorna el resultado.
                    } catch (parseError) {
                        reject(new Error(`Error al analizar la salida de MiniZinc: ${parseError.message}`));
                    } finally {
                        fs.unlink(tempOutputPath).catch(console.error); // Borra el archivo de salida temporal.
                    }
                });
            });
        } catch (error) {
            throw new Error(`Error al resolver el modelo: ${error.message}`);
        }
    }

    /**
     * Analiza la salida JSON de MiniZinc y la convierte en un objeto útil.
     * 
     * @param {string} output - Salida en formato JSON de MiniZinc.
     * @param {Object} data - Datos de entrada proporcionados.
     * @returns {Object} - Resultado procesado con valores por defecto.
     */
    parseOutput(output, data) {
        try {
            console.log("Raw output:", output);
            const result = JSON.parse(output); // Convierte el JSON en un objeto de JavaScript.
            console.log("Parsed result:", result);

            // Devuelve un objeto con los resultados procesados.
            return {
                nuevasUbicaciones: {
                    x: result.new_x || [], // Coordenadas x de nuevas ubicaciones.
                    y: result.new_y || []  // Coordenadas y de nuevas ubicaciones.
                },
                ubicacionesExistentes: {
                    x: result.pos_x_existentes || [], // Coordenadas x existentes.
                    y: result.pos_y_existentes || []  // Coordenadas y existentes.
                },
                gananciaOriginal: result.ganancia_existente || 0, // Ganancia inicial.
                gananciaTotal: result.ganancia_total || 0         // Ganancia total.
            };
        } catch (error) {
            console.error("Error parsing output:", error);
            console.log("Problematic output:", output);
            throw new Error("Error al analizar el JSON de salida: " + error.message);
        }
    }

    /**
     * Convierte los datos de entrada en formato .dzn (MiniZinc).
     * 
     * @param {Object} data - Datos de entrada.
     * @returns {string} - Representación en formato .dzn.
     */
    convertToDzn(data) {
        if (!Array.isArray(data.posXExistentes) || !Array.isArray(data.posYExistentes)) {
            throw new Error("Las coordenadas de ubicaciones existentes no son válidas.");
        }
        if (!Array.isArray(data.poblacion) || !Array.isArray(data.empresarial)) {
            throw new Error("Los datos de población o empresariales no son válidos.");
        }
        // Genera el contenido del archivo .dzn.
        return `
            n = ${data.n};
            num_existentes = ${data.numExistentes};
            num_nuevos = ${data.numNuevos};
            pos_x_existentes = [${data.posXExistentes.join(', ')}];
            pos_y_existentes = [${data.posYExistentes.join(', ')}];
            poblacion = [| ${data.poblacion.map(row => row.join(', ')).join(' | ')} |];
            empresarial = [| ${data.empresarial.map(row => row.join(', ')).join(' | ')} |];
        `;
    }

    /**
     * Extrae un bloque JSON de la salida de MiniZinc.
     * 
     * @param {string} output - Salida bruta de MiniZinc.
     * @returns {string} - JSON extraído.
     */
    extractJson(output) {
        const jsonMatch = output.match(/{[\s\S]*}/); // Busca un bloque JSON.
        if (!jsonMatch) {
            throw new Error("No se pudo encontrar un JSON válido en la salida.");
        }
        return jsonMatch[0];
    }
}

// Exporta la clase para su uso en otros módulos.
module.exports = MinizincWrapper;
