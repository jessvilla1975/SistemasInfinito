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
            throw new Error('Error en el servidor');
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

// El resto de las funciones (parseInputFile, processSolution, etc.) se mantienen igual