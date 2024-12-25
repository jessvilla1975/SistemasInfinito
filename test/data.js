/*
Integrantes:
Alejandro Marin Hoyos - 2259353-3743
Yessica Fernanda Villa Nuñez - 2266301-3743
Manuel Antonio Vidales Duran - 2155481-3743
*/

// data.js
module.exports = {
    input: {
        n: 15, // Tamaño de la matriz
        num_existentes: 3, // Número de ubicaciones existentes
        num_nuevos: 4, // Número de nuevas ubicaciones
        pos_x_existentes: [6, 8, 10], // Coordenadas X de ubicaciones existentes
        pos_y_existentes: [8, 4, 10], // Coordenadas Y de ubicaciones existentes
        // Resultados esperados
        new_x: [13, 14, 12, 11], // Coordenadas X de nuevas ubicaciones
        new_y: [7, 9, 9, 7], // Coordenadas Y de nuevas ubicaciones
        ganancia_existente_esperada: 328, // Ganancia esperada para las existentes
        ganancia_total_esperada: 1833 // Ganancia esperada para todas
    },
     // Matriz `poblacion` que representa la distribución de la población en una región de 15x15.
    poblacion: [
        [4,0,1,1,2,2,0,0,4,15,15,4,11,2,1],
        [4,0,3,1,6,2,0,0,4,15,15,4,8,2,1],
        [4,0,3,1,6,2,0,0,4,9,9,4,2,2,2],
        [0,0,1,1,21,23,4,4,4,16,16,4,2,2,2],
        [0,0,1,1,20,20,0,4,4,16,16,4,4,2,2],
        [0,0,1,1,15,18,0,4,4,5,5,4,2,8,2],
        [0,0,1,1,2,2,4,0,4,16,16,4,2,7,1],
        [5,7,3,1,2,2,4,4,4,16,16,4,2,2,1],
        [5,7,3,1,2,2,2,2,4,5,5,1,2,2,2],
        [5,7,9,1,2,2,14,14,14,16,16,4,2,2,2],
        [0,0,1,1,2,2,34,34,34,11,20,5,6,14,2],
        [0,0,1,1,2,25,34,34,4,16,16,4,1,2,2],
        [0,0,4,1,2,25,34,34,4,16,16,4,2,2,2],
        [0,0,4,1,2,25,34,34,4,16,16,4,3,3,2],
        [0,0,1,1,2,2,4,4,4,16,16,4,2,8,8]
    ],
    // Matriz `empresarial` que representa la actividad empresarial en la región de 15x15.
    empresarial: [
        [0,0,1,1,2,2,4,13,4,16,16,4,2,6,2],
        [0,0,1,1,2,2,4,13,4,16,16,4,2,6,2],
        [0,0,1,10,2,2,4,4,4,16,16,4,2,2,2],
        [0,0,1,1,21,23,4,4,4,16,16,4,2,2,2],
        [0,0,1,1,20,20,4,4,4,16,16,4,4,5,2],
        [0,0,1,1,15,18,4,4,4,16,16,4,4,5,2],
        [0,0,1,1,2,9,4,4,4,16,16,4,2,2,2],
        [18,18,1,1,9,2,11,4,4,16,16,4,2,2,2],
        [35,18,1,1,2,2,12,4,4,16,16,4,6,2,2],
        [18,18,10,1,8,2,4,4,4,16,16,4,2,2,2],
        [0,0,1,1,2,2,4,4,4,16,16,4,2,14,2],
        [0,0,9,1,2,25,34,50,4,16,16,4,13,2,2],
        [0,0,9,1,2,25,44,34,4,16,16,4,2,9,2],
        [0,0,1,1,5,25,34,34,4,16,16,4,2,9,2],
        [0,0,1,1,5,2,4,4,4,16,16,4,2,18,18]
    ]
};