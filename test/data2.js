/*
Integrantes:
Alejandro Marin Hoyos - 2259353-3743
Yessica Fernanda Villa Nuñez - 2266301-3743
Manuel Antonio Vidales Duran - 2155481-3743
*/
const input = {
    n: 5, // Tamaño de la matriz
    num_existentes: 2, // Número de ubicaciones existentes
    pos_x_existentes: [1, 5], // Coordenadas X de ubicaciones existentes
    pos_y_existentes: [1, 5], // Coordenadas Y de ubicaciones existentes
    num_nuevos: 2, // Número de nuevas ubicaciones
    new_x: [3, 2], // Coordenadas X de nuevas ubicaciones
    new_y: [3, 4], // Coordenadas Y de nuevas ubicaciones
    ganancia_existente_esperada: 520, // Ganancia esperada para las existentes
    ganancia_total_esperada: 1735 // Ganancia esperada para todas
};
// Matriz `poblacion` que representa la distribución poblacional en la matriz (5x5).
const poblacion = [
    [10, 20, 30, 40, 50],
    [15, 25, 35, 45, 55],
    [20, 30, 40, 50, 60],
    [25, 35, 45, 55, 65],
    [30, 40, 50, 60, 70]
];
// Matriz `empresarial` que representa la distribución de actividad empresarial en la matriz (5x5).
const empresarial = [
    [5, 10, 15, 20, 25],
    [10, 15, 20, 25, 30],
    [15, 20, 25, 30, 35],
    [20, 25, 30, 35, 40],
    [25, 30, 35, 40, 45]
];
// Exportación de los datos para que puedan ser utilizados en otros módulos o archivos.
module.exports = { input, poblacion, empresarial };
