const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class MinizincWrapper {
    constructor() {
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
        const tempDataPath = path.join(__dirname, '../temp', `data_${Date.now()}.dzn`);
        const dznContent = this.convertToDzn(data);

        try {
            await fs.writeFile(tempDataPath, dznContent);

            return new Promise((resolve, reject) => {
                exec(`minizinc ${modelPath} ${tempDataPath}`, (error, stdout, stderr) => {
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
            const lines = output.trim().split('\n');
            if (lines.length < 3) {
                throw new Error("La salida no contiene las líneas esperadas.");
            }

            const ganancia = lines[0].split(':')[1].trim();
            const newX = lines[2].split(' ').map(Number);
            const newY = lines[3].split(' ').map(Number);

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
