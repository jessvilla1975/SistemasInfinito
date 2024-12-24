const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class MinizincWrapper {
    constructor() {
        // Verificar que MiniZinc está instalado
        this.checkMinizincInstallation();
    }

    checkMinizincInstallation() {
        exec('minizinc --version', (error) => {
            if (error) {
                console.error('Error: MiniZinc no está instalado o no está en el PATH');
                process.exit(1);
            }
        });
    }

    async solve(modelPath, data) {
        // Crear archivo temporal con los datos
        const tempDataPath = path.join(__dirname, '../temp', `data_${Date.now()}.dzn`);
        
        // Convertir datos a formato .dzn
        const dznContent = this.convertToDzn(data);
        
        try {
            // Escribir archivo temporal
            await fs.writeFile(tempDataPath, dznContent);
            
            // Ejecutar MiniZinc
            return new Promise((resolve, reject) => {
                exec(`minizinc ${modelPath} ${tempDataPath}`, (error, stdout, stderr) => {
                    // Limpiar archivo temporal
                    fs.unlink(tempDataPath).catch(console.error);
                    
                    if (error) {
                        reject(new Error(stderr));
                        return;
                    }
                    resolve(this.parseOutput(stdout));
                });
            });
        } catch (error) {
            throw new Error(`Error al resolver el modelo: ${error.message}`);
        }
    }

    convertToDzn(data) {
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

    parseOutput(output) {
        try {
            // Dividir la salida en líneas
            const lines = output.trim().split('\n');
            
            // Verificar que la salida contiene al menos 3 líneas
            if (lines.length < 3) {
                throw new Error("La salida no contiene las líneas esperadas.");
            }
    
            // Extraer los valores de las líneas
            const ganancia = lines[0].split(':')[1].trim();  // Ganancia total
            const nuevasUbicacionesLabel = lines[1];         // 'Nuevas ubicaciones:'
            const newX = lines[2].split(' ').map(Number);    // Convertir la línea a un arreglo de números
            const newY = lines[3].split(' ').map(Number);    // Convertir la línea a un arreglo de números
            
            // Devolver un objeto con los resultados
            return {
                ganancia: parseFloat(ganancia),
                nuevasUbicaciones: {
                    x: newX,
                    y: newY
                }
            };
            
        } catch (error) {
            console.error("Error al parsear la salida:", error.message);
            throw new Error(`Error al parsear la salida: ${error.message}`);
        }
    }
    
    
    
    
}

module.exports = MinizincWrapper;
