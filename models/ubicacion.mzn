% Parámetros de entrada
int: n;  % Tamaño de la matriz
int: num_existentes;  % Número de localizaciones existentes
int: num_nuevos;  % Número de nuevas localizaciones a ubicar

% Arrays para las posiciones existentes
array[1..num_existentes] of int: pos_x_existentes;
array[1..num_existentes] of int: pos_y_existentes;

% Matrices de población y entorno empresarial
array[1..n, 1..n] of int: poblacion;
array[1..n, 1..n] of int: empresarial;

% Variables de decisión para las nuevas ubicaciones
array[1..num_nuevos] of var 0..n-1: new_x;
array[1..num_nuevos] of var 0..n-1: new_y;

% Función para calcular el segmento de población/empresarial de un punto
function var int: calcular_segmento(array[1..n, 1..n] of int: matriz, var int: x, var int: y) =
  sum([matriz[x_adj, y_adj] | 
      x_adj in max(1, x-1)..min(n, x+1),
      y_adj in max(1, y-1)..min(n, y+1)]);

% Restricciones
% 1. No pueden ser contiguos a los existentes
constraint forall(i in 1..num_nuevos)(
  forall(j in 1..num_existentes)(
    abs(new_x[i] - pos_x_existentes[j]) > 1 \/ 
    abs(new_y[i] - pos_y_existentes[j]) > 1
  )
);

% 2. No pueden ser contiguos entre sí
constraint forall(i, j in 1..num_nuevos where i < j)(
  abs(new_x[i] - new_x[j]) > 1 \/ 
  abs(new_y[i] - new_y[j]) > 1
);

% 3. Segmento de población mínimo de 25
constraint forall(i in 1..num_nuevos)(
  calcular_segmento(poblacion, new_x[i], new_y[i]) >= 25
);

% 4. Entorno empresarial mínimo de 20
constraint forall(i in 1..num_nuevos)(
  calcular_segmento(empresarial, new_x[i], new_y[i]) >= 20
);

% Calcular ganancia total de las localizaciones existentes
function int: calcular_segmento_const(array[1..n, 1..n] of int: matriz, int: x, int: y) =
  sum([matriz[x_adj, y_adj] | 
      x_adj in max(1, x-1)..min(n, x+1),
      y_adj in max(1, y-1)..min(n, y+1)]);

int: ganancia_existente = sum(i in 1..num_existentes)(
  calcular_segmento_const(poblacion, pos_x_existentes[i], pos_y_existentes[i]) +
  calcular_segmento_const(empresarial, pos_x_existentes[i], pos_y_existentes[i])
);

% Calcular ganancia total después de agregar las nuevas localizaciones
var int: ganancia_total = ganancia_existente + sum(i in 1..num_nuevos)(
  calcular_segmento(poblacion, new_x[i], new_y[i]) + 
  calcular_segmento(empresarial, new_x[i], new_y[i])
);

% Función objetivo: maximizar la suma de población y entorno empresarial
solve maximize sum(i in 1..num_nuevos)(
  calcular_segmento(poblacion, new_x[i], new_y[i]) + 
  calcular_segmento(empresarial, new_x[i], new_y[i])
);

% Output
output [
  "Ganancia total sin incluir las nuevas localizaciones: ", show(ganancia_existente), "\n",
  "Ganancia total después de agregar las nuevas localizaciones: ", show(ganancia_total), "\n",
  "Nuevas ubicaciones:\n",
  show(new_x),
  "\n",
  show(new_y)
];
