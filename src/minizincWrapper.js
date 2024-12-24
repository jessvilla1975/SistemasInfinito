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
        const tempOutputPath = path.join(__dirname, '../temp', `output_${Date.now()}.txt`);
        const dznContent = this.convertToDzn(data);

        try {
            const tempDir = path.join(__dirname, '../temp');
            await fs.mkdir(tempDir, { recursive: true });
            await fs.writeFile(tempDataPath, dznContent);

            return new Promise((resolve, reject) => {
                exec(`minizinc --output-mode json ${modelPath} ${tempDataPath}`, async (error, stdout, stderr) => {
                    console.log("Raw MiniZinc output:", stdout); 
                    fs.unlink(tempDataPath).catch(console.error);

                    if (error) {
                        reject(new Error(`Error al ejecutar MiniZinc: ${stderr || error.message}`));
                        return;
                    }

                    try {
                        console.log("Salida de MiniZinc:", stdout);

                        const jsonOutput = this.extractJson(stdout);
                        await fs.writeFile(tempOutputPath, jsonOutput);

                        const result = this.parseOutput(jsonOutput, data);
                        resolve(result);
                    } catch (parseError) {
                        reject(new Error(`Error al analizar la salida de MiniZinc: ${parseError.message}`));
                    } finally {
                        fs.unlink(tempOutputPath).catch(console.error);
                    }
                });
            });
        } catch (error) {
            throw new Error(`Error al resolver el modelo: ${error.message}`);
        }
    }

    parseOutput(output, data ) {
        const dznContent = this.convertToDzn(data);
        try {
            console.log("Raw output:", output);
            const result = JSON.parse(output);
            console.log("Parsed result:", result);
            
            // Crear un objeto con valores por defecto en caso de que falten datos
            return {
                nuevasUbicaciones: {
                    x: result.new_x || [],
                    y: result.new_y || []
                },
                ubicacionesExistentes: {
                    x: result.pos_x_existentes|| [],
                    y: result.pos_y_existentes || []
                },
                
                gananciaOriginal: result.ganancia_existente || 0,
                gananciaTotal: result.ganancia_total || 0,
          
            };
        } catch (error) {
            console.error("Error parsing output:", error);
            console.log("Problematic output:", output);
            throw new Error("Error al analizar el JSON de salida: " + error.message);
        }
    }
    

    convertToDzn(data) {
        if (!Array.isArray(data.posXExistentes) || !Array.isArray(data.posYExistentes)) {
            throw new Error("Las coordenadas de ubicaciones existentes no son válidas.");
        }
        if (!Array.isArray(data.poblacion) || !Array.isArray(data.empresarial)) {
            throw new Error("Los datos de población o empresariales no son válidos.");
        }
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

    extractJson(output) {
        const jsonMatch = output.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            throw new Error("No se pudo encontrar un JSON válido en la salida.");
        }
        return jsonMatch[0];
    }

}

module.exports = MinizincWrapper;