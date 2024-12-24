let currentSolution = null;

async function resolverProblema() {
    const fileInput = document.getElementById('inputFile');
    const resultDiv = document.getElementById('result');
    const saveButton = document.getElementById('saveButton');
    
    if (!fileInput.files[0]) {
        alert('Por favor seleccione un archivo');
        return;
    }

    try {
        // Leer el archivo
        const fileContent = await fileInput.files[0].text();
        const data = parseInputFile(fileContent);
        
        // Enviar datos al servidor
        const response = await fetch('/solve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error en el servidor: ${errorText}`);
        }
        

        const solution = await response.json();
        
        // Procesar la solución
        currentSolution = processSolution(solution, data);
        resultDiv.textContent = formatSolution(currentSolution);
        saveButton.style.display = 'block';
    } catch (error) {
        console.error(error);
        resultDiv.textContent = 'Error: ' + error.message;
        saveButton.style.display = 'none';
    }
}
function parseInputFile(content) {
    const lines = content.split('\n');
    let currentLine = 0;
    
    const numExistentes = parseInt(lines[currentLine++]);
    const posXExistentes = [];
    const posYExistentes = [];
    
    for (let i = 0; i < numExistentes; i++) {
        const [x, y] = lines[currentLine++].split(' ').map(Number);
        posXExistentes.push(x);
        posYExistentes.push(y);
    }
    
    const n = parseInt(lines[currentLine++]);
    
    const poblacion = [];
    for (let i = 0; i < n; i++) {
        poblacion.push(lines[currentLine++].split(' ').map(Number));
    }
    
    const empresarial = [];
    for (let i = 0; i < n; i++) {
        empresarial.push(lines[currentLine++].split(' ').map(Number));
    }
    
    const numNuevos = parseInt(lines[currentLine]);
    
    return {
        n,
        numExistentes,
        numNuevos,
        posXExistentes,
        posYExistentes,
        poblacion,
        empresarial
    };
}

function processSolution(solution, data) {
    const newX = solution.new_x;
    const newY = solution.new_y;
    
    // Calcular ganancias
    let gananciaOriginal = 0;
    let gananciaTotal = gananciaOriginal;
    
    // Agregar las nuevas ubicaciones
    const nuevasUbicaciones = [];
    for (let i = 0; i < data.numNuevos; i++) {
        nuevasUbicaciones.push([newX[i], newY[i]]);
        gananciaTotal += calculateGain(newX[i], newY[i], data.poblacion, data.empresarial);
    }
    
    return {
        gananciaOriginal,
        gananciaTotal,
        ubicacionesExistentes: data.posXExistentes.map((x, i) => [x, data.posYExistentes[i]]),
        nuevasUbicaciones
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
    for (let i = Math.max(0, x-1); i <= Math.min(poblacion.length-1, x+1); i++) {
        for (let j = Math.max(0, y-1); j <= Math.min(poblacion[0].length-1, y+1); j++) {
            gain += poblacion[i][j] + empresarial[i][j];
        }
    }
    return gain;
}