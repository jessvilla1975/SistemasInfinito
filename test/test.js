/*
Integrantes:
Alejandro Marin Hoyos - 2259353-3743
Yessica Fernanda Villa Nuñez - 2266301-3743
Manuel Antonio Vidales Duran - 2155481-3743
*/
const data1 = require('./data.js');
const data2 = require('./data2.js');
const data3 = require('./data3.js');
// Función para calcular el segmento
function calcularSegmento(matriz, x, y, n) {
    let suma = 0;
    for (let i = Math.max(0, x - 1); i <= Math.min(n - 1, x + 1); i++) {
        for (let j = Math.max(0, y - 1); j <= Math.min(n - 1, y + 1); j++) {
            suma += matriz[i][j];
        }
    }
    return suma;
}

// Función para calcular la ganancia existente
function calcularGananciaExistente(input, poblacion, empresarial) {
    let ganancia = 0;
    for (let i = 0; i < input.num_existentes; i++) {
        const x = input.pos_x_existentes[i] - 1; // Ajustar índice basado en 1 a basado en 0
        const y = input.pos_y_existentes[i] - 1;
        ganancia += calcularSegmento(poblacion, x, y, input.n);
        ganancia += calcularSegmento(empresarial, x, y, input.n);
    }
    return ganancia;
}

// Función para calcular la ganancia total
function calcularGananciaTotal(input, poblacion, empresarial) {
    let ganancia = calcularGananciaExistente(input, poblacion, empresarial);
    for (let i = 0; i < input.num_nuevos; i++) {
        const x = input.new_x[i] - 1; // Ajustar índice basado en 1 a basado en 0
        const y = input.new_y[i] - 1;
        ganancia += calcularSegmento(poblacion, x, y, input.n);
        ganancia += calcularSegmento(empresarial, x, y, input.n);
    }
    return ganancia;
}

// Test suite
function runTests(data, testName) {
    console.log(`\n=== Iniciando ${testName} ===\n`);
    const { input, poblacion, empresarial } = data;

    // Test 1: Verificar no contigüidad entre existentes y nuevas
    let passTest1 = true;
    console.log('[ ] Test 1: Verificando no contigüidad entre ubicaciones existentes y nuevas...');
    for (let i = 0; i < input.num_nuevos; i++) {
        for (let j = 0; j < input.num_existentes; j++) {
            if (Math.abs(input.new_x[i] - input.pos_x_existentes[j]) <= 1 &&
                Math.abs(input.new_y[i] - input.pos_y_existentes[j]) <= 1) {
                passTest1 = false;
                console.log(`    ❌ Error: Ubicación nueva (${input.new_x[i]},${input.new_y[i]}) es contigua a existente (${input.pos_x_existentes[j]},${input.pos_y_existentes[j]})`);
            }
        }
    }
    console.log(passTest1 ? '    [✓] Test 1: Pasado' : '    [✗] Test 1: Fallado');

    // Test 2: Verificar ganancia existente
    console.log('\n[ ] Test 2: Verificando ganancia de localizaciones existentes...');
    const gananciaExistente = calcularGananciaExistente(input, poblacion, empresarial);
    const passTest2 = gananciaExistente === input.ganancia_existente_esperada;
    console.log(`    Ganancia existente calculada: ${gananciaExistente}`);
    console.log(`    Ganancia existente esperada: ${input.ganancia_existente_esperada}`);
    console.log(passTest2 ? '    [✓] Test 2: Pasado' : '    [✗] Test 2: Fallado');

    // Test 3: Verificar ganancia total
    console.log('\n[ ] Test 3: Verificando ganancia total...');
    const gananciaTotal = calcularGananciaTotal(input, poblacion, empresarial);
    const passTest3 = gananciaTotal === input.ganancia_total_esperada;
    console.log(`    Ganancia total calculada: ${gananciaTotal}`);
    console.log(`    Ganancia total esperada: ${input.ganancia_total_esperada}`);
    console.log(passTest3 ? '    [✓] Test 3: Pasado' : '    [✗] Test 3: Fallado');

    // Resumen final
    console.log('\nResumen de pruebas:');
    const resultados = [passTest1, passTest2, passTest3];
    console.log(`Total de pruebas: ${resultados.length}`);
    console.log(`Pruebas pasadas: ${resultados.filter(x => x).length}`);
    console.log(`Pruebas fallidas: ${resultados.filter(x => !x).length}`);
}

// Ejecutar pruebas para ambos datasets
runTests(data1, 'Prueba 1 (data.js)');
runTests(data2, 'Prueba 2 (data2.js)');
runTests(data3, 'Prueba 3 (data3.js)');
