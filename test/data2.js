// Simulación de datos de entrada y salida para el test de la función de cálculo de ganancias
module.exports = {
    input: {
        n: 7, // Tamaño de la matriz
        num_existentes: 2, // Número de ubicaciones existentes
        num_nuevos: 4, // Número de nuevas ubicaciones
        pos_x_existentes: [3, 1], // Equivalentes escalados de Cali y Tuluá
        pos_y_existentes: [1, 5], 
        // Resultados esperados
        new_x: [1], // Nueva ubicación propuesta
        new_y: [1],
        ganancia_existente_esperada: 97, // Ganancia esperada para las existentes
        ganancia_total_esperada: 129 // Ganancia total esperada
    },
    // Matriz de población simplificada 7x7
    poblacion: [
        [2, 3, 8, 1, 6, 5, 0],
        [9, 4, 7, 3, 2, 1, 8],
        [5, 0, 1, 9, 4, 7, 3],
        [8, 3, 2, 5, 7, 0, 4],
        [1, 6, 9, 4, 3, 8, 2],
        [4, 7, 0, 8, 1, 6, 9],
        [3, 2, 5, 0, 9, 4, 7]
    ],
    
    // Matriz empresarial simplificada 5x5
    empresarial: [
        [6, 2, 9, 3, 0, 7, 5],
        [1, 5, 8, 2, 4, 6, 3],
        [4, 9, 1, 0, 7, 3, 6],
        [2, 7, 6, 8, 9, 1, 4],
        [3, 4, 0, 5, 8, 9, 2],
        [9, 1, 2, 4, 6, 0, 8],
        [5, 3, 7, 9, 2, 4, 1]
    ]    
};