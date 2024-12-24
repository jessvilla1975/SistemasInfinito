let currentSolution = null;

function mostrarResultado(result) {
    const resultDiv = document.getElementById('result');
    
    // Asegurarse de que todas las propiedades necesarias existan
    const safeResult = {
   
        nuevasUbicaciones: {
            x: result.nuevasUbicaciones?.x || [],
            y: result.nuevasUbicaciones?.y || []
        },
        gananciaOriginal: result.gananciaOriginal || 0,
        gananciaTotal: result.gananciaTotal || 0
        
    };
    
    const html = `
        <div class="result-container">
            <div class="metrics-section">
                <h3>Métricas de Ganancia</h3>
                <table class="metrics-table">
                    <tr>
                        <th>Tipo de Ganancia</th>
                        <th>Valor</th>
                    </tr>
                    <tr>
                        <td>Ganancia Existente</td>
                        <td>${safeResult.gananciaOriginal}</td>
                    </tr>
                    <tr>
                        <td>Ganancia Total</td>
                        <td>${safeResult.gananciaTotal}</td>
                    </tr>

                    
                </table>
            </div>

            ${safeResult.nuevasUbicaciones.x.length > 0 ? `
                <div class="locations-section">
                    <h3>Nuevas Ubicaciones Encontradas</h3>
                    <table class="locations-table">
                        <tr>
                            <th>Posición</th>
                            <th>Coordenada X</th>
                            <th>Coordenada Y</th>
                        </tr>
                        ${safeResult.nuevasUbicaciones.x.map((x, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${x}</td>
                                <td>${safeResult.nuevasUbicaciones.y[i]}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            ` : ''}

            
        </div>
    `;

    resultDiv.innerHTML = html;
}


async function resolverProblema() {
    const fileInput = document.getElementById('inputFile');
    const resultDiv = document.getElementById('result');
    const saveButton = document.getElementById('saveButton');

    if (!fileInput.files[0]) {
        alert('Por favor seleccione un archivo');
        return;
    }

    try {
        const fileContent = await fileInput.files[0].text();
        const data = parseInputFile(fileContent);

        const response = await fetch('/solve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error en el servidor: ${errorText}`);
        }

        const result = await response.json();
        currentSolution = result;
        mostrarResultado(result);
        
        saveButton.style.display = 'block';
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        saveButton.style.display = 'none';
    }
}

// Estilos CSS para agregar
const styles = `
.result-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.metrics-section {
    margin-bottom: 30px;
}

.metrics-table, .locations-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 20px;
}

.metrics-table th,
.metrics-table td,
.locations-table th,
.locations-table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
}

.metrics-table th,
.locations-table th {
    background-color: #f5f5f5;
    font-weight: bold;
}

.metrics-table tr:nth-child(even),
.locations-table tr:nth-child(even) {
    background-color: #fafafa;
}

.error-message {
    color: #d32f2f;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
    margin-top: 10px;
}

h3 {
    color: #333;
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 1.2em;
}

.metrics-table td:last-child {
    font-weight: bold;
    color: #2196F3;
}
`;

function guardarSolucion(result) {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resultado.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function parseInputFile(content) {
    const lines = content.split('\n').filter(line => line.trim() !== ''); // Filtrar líneas vacías
    let currentLine = 0;

    try {
        const numExistentes = parseInt(lines[currentLine++]);
        if (isNaN(numExistentes)) throw new Error('Número de ubicaciones existentes inválido.');

        const posXExistentes = [];
        const posYExistentes = [];

        for (let i = 0; i < numExistentes; i++) {
            const [x, y] = lines[currentLine++].split(' ').map(Number);
            if (isNaN(x) || isNaN(y)) throw new Error('Coordenadas de ubicación existentes inválidas.');
            posXExistentes.push(x);
            posYExistentes.push(y);
        }

        const n = parseInt(lines[currentLine++]);
        if (isNaN(n)) throw new Error('Valor de n inválido.');

        const poblacion = [];
        for (let i = 0; i < n; i++) {
            const row = lines[currentLine++].split(' ').map(Number);
            if (row.some(isNaN)) throw new Error('Datos de población inválidos.');
            poblacion.push(row);
        }

        const empresarial = [];
        for (let i = 0; i < n; i++) {
            const row = lines[currentLine++].split(' ').map(Number);
            if (row.some(isNaN)) throw new Error('Datos empresariales inválidos.');
            empresarial.push(row);
        }

        const numNuevos = parseInt(lines[currentLine++]);
        if (isNaN(numNuevos)) throw new Error('Número de ubicaciones nuevas inválido.');

        return {
            n,
            numExistentes,
            numNuevos,
            posXExistentes,
            posYExistentes,
            poblacion,
            empresarial,
        };
    } catch (error) {
        throw new Error(`Error al parsear el archivo de entrada: ${error.message}`);
    }
}

function processSolution(solution, data) {
    const newX = solution.new_x;
    const newY = solution.new_y;

    // Calcular ganancias
    let gananciaOriginal = 0;
    let gananciaTotal = gananciaOriginal;

    const nuevasUbicaciones = [];
    for (let i = 0; i < data.numNuevos; i++) {
        if (newX[i] === undefined || newY[i] === undefined) {
            throw new Error('Coordenadas de nuevas ubicaciones no definidas.');
        }
        nuevasUbicaciones.push([newX[i], newY[i]]);
        gananciaTotal += calculateGain(newX[i], newY[i], data.poblacion, data.empresarial);
    }

    return {
        gananciaOriginal,
        gananciaTotal,
        ubicacionesExistentes: data.posXExistentes.map((x, i) => [x, data.posYExistentes[i]]),
        nuevasUbicaciones,
    };
}

function formatSolution(solution) {
    return `${solution.gananciaOriginal}\n${solution.gananciaTotal}\n` +
           solution.ubicacionesExistentes.map(([x, y]) => `${x} ${y}`).join('\n') + '\n' +
           solution.nuevasUbicaciones.map(([x, y]) => `${x} ${y}`).join('\n');
}

function guardarSolucion() {
    if (!currentSolution) return;

    const blob = new Blob([formatSolution(currentSolution)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solucion.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function calculateGain(x, y, poblacion, empresarial) {
    let gain = 0;
    for (let i = Math.max(0, x - 1); i <= Math.min(poblacion.length - 1, x + 1); i++) {
        for (let j = Math.max(0, y - 1); j <= Math.min(poblacion[0].length - 1, y + 1); j++) {
            gain += poblacion[i][j] + empresarial[i][j];
        }
    }
    return gain;
}

