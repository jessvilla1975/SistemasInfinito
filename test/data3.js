// Simulación de datos de entrada y salida para el test de la función de cálculo de ganancias
module.exports = {
    input: {
        n: 5,
        num_existentes: 2,
        num_nuevos: 1,
        pos_x_existentes: [2, 3],
        pos_y_existentes: [3, 2],
        // Resultados esperados
        new_x: [4],
        new_y: [4],
        ganancia_existente_esperada: 157,
        ganancia_total_esperada: 270
    },
    // Matriz de población con valores más altos
    poblacion: [
        [3, 2, 2, 3, 4],
        [2, 4, 5, 4, 3],
        [2, 3, 8, 6, 4],
        [3, 4, 6, 10, 5],
        [4, 3, 4, 5, 8]
    ],
    // Matriz empresarial con valores más altos
    empresarial: [
        [2, 3, 2, 3, 3],
        [3, 5, 4, 4, 4],
        [2, 4, 9, 8, 3],
        [3, 3, 8, 12, 4],
        [3, 4, 3, 4, 6]
    ]
};