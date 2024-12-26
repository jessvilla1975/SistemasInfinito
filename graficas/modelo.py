"""
Integrantes:
Alejandro Marin Hoyos - 2259353-3743
Yessica Fernanda Villa Nuñez - 2266301-3743
Manuel Antonio Vidales Duran - 2155481-3743 """

import numpy as np
import matplotlib.pyplot as plt

# Matriz de población (15x15)
poblacion = np.array([
    [4, 0, 1, 1, 2, 2, 0, 0, 4, 15, 15, 4, 11, 2, 1],
    [4, 0, 3, 1, 6, 2, 0, 0, 4, 15, 15, 4, 8, 2, 1],
    [4, 0, 3, 1, 6, 2, 0, 0, 4, 9, 9, 4, 2, 2, 2],
    [0, 0, 1, 1, 21, 23, 4, 4, 4, 16, 16, 4, 2, 2, 2],
    [0, 0, 1, 1, 20, 20, 0, 4, 4, 16, 16, 4, 4, 2, 2],
    [0, 0, 1, 1, 15, 18, 0, 4, 4, 5, 5, 4, 2, 8, 2],
    [0, 0, 1, 1, 2, 2, 4, 0, 4, 16, 16, 4, 2, 7, 1],
    [5, 7, 3, 1, 2, 2, 4, 4, 4, 16, 16, 4, 2, 2, 1],
    [5, 7, 3, 1, 2, 2, 2, 2, 4, 5, 5, 1, 2, 2, 2],
    [5, 7, 9, 1, 2, 2, 14, 14, 14, 16, 16, 4, 2, 2, 2],
    [0, 0, 1, 1, 2, 2, 34, 34, 34, 11, 20, 5, 6, 14, 2],
    [0, 0, 1, 1, 2, 25, 34, 34, 4, 16, 16, 4, 1, 2, 2],
    [0, 0, 4, 1, 2, 25, 34, 34, 4, 16, 16, 4, 2, 2, 2],
    [0, 0, 4, 1, 2, 25, 34, 34, 4, 16, 16, 4, 3, 3, 2],
    [0, 0, 1, 1, 5, 25, 34, 34, 4, 16, 16, 4, 2, 8, 8]
])

# Matriz de entorno empresarial (15x15)
empresarial = np.array([
    [0, 0, 1, 1, 2, 2, 4, 13, 4, 16, 16, 4, 2, 6, 2],
    [0, 0, 1, 1, 2, 2, 4, 13, 4, 16, 16, 4, 2, 6, 2],
    [0, 0, 1, 10, 2, 2, 4, 4, 4, 16, 16, 4, 2, 2, 2],
    [0, 0, 1, 1, 21, 23, 4, 4, 4, 16, 16, 4, 2, 2, 2],
    [0, 0, 1, 1, 20, 20, 4, 4, 4, 16, 16, 4, 4, 5, 2],
    [0, 0, 1, 1, 15, 18, 4, 4, 4, 16, 16, 4, 4, 5, 2],
    [0, 0, 1, 1, 2, 9, 4, 4, 4, 16, 16, 4, 2, 2, 2],
    [18, 18, 1, 1, 9, 2, 11, 4, 4, 16, 16, 4, 2, 2, 2],
    [35, 18, 1, 1, 2, 2, 12, 4, 4, 16, 16, 4, 6, 2, 2],
    [18, 18, 10, 1, 8, 2, 4, 4, 4, 16, 16, 4, 2, 2, 2],
    [0, 0, 1, 1, 2, 2, 4, 4, 4, 16, 16, 4, 2, 14, 2],
    [0, 0, 9, 1, 2, 25, 34, 50, 4, 16, 16, 4, 13, 2, 2],
    [0, 0, 9, 1, 2, 25, 44, 34, 4, 16, 16, 4, 2, 9, 2],
    [0, 0, 1, 1, 5, 25, 34, 34, 4, 16, 16, 4, 2, 9, 2],
    [0, 0, 1, 1, 5, 2, 4, 4, 4, 16, 16, 4, 2, 18, 18]
])

# Crear la figura y los subplots
fig, axes = plt.subplots(1, 2, figsize=(15, 7))

# Coordenadas (ajustadas para índices base 0)
existentes = [(6, 8), (8, 4), (10, 10)]  # Restando 1 a las coordenadas originales
nuevas_ubicaciones = [(14,9), (11,7)]  # Restando 1 a las coordenadas originales

# Función para marcar ubicaciones
def marcar_ubicaciones(ax, existentes, nuevas, titulo):
    # Mostrar la matriz base
    im = ax.imshow(poblacion if "Población" in titulo else empresarial, 
                  cmap='Blues' if "Población" in titulo else 'Reds')
    
    # Marcar ubicaciones existentes con círculos rojos
    for x, y in existentes:
        ax.plot(y, x, 'ro', markersize=10, markeredgecolor='red', markerfacecolor='none')
    
    # Marcar nuevas ubicaciones con círculos azules
    for x, y in nuevas_ubicaciones:
        ax.plot(y, x, 'bo', markersize=10, markeredgecolor='blue', markerfacecolor='none')
    
    # Configuración adicional
    ax.set_title(titulo)
    ax.grid(True, color='gray', linestyle='--', linewidth=0.5)
    ax.set_xticks(range(15))
    ax.set_yticks(range(15))
    return im

# Crear las visualizaciones
im1 = marcar_ubicaciones(axes[0], existentes, nuevas_ubicaciones, "Matriz de Población")
im2 = marcar_ubicaciones(axes[1], existentes, nuevas_ubicaciones, "Matriz de Entorno Empresarial")

# Añadir leyenda
from matplotlib.lines import Line2D
legend_elements = [
    Line2D([0], [0], marker='o', color='w', markerfacecolor='none',
           markeredgecolor='red', markersize=10, label='Ubicaciones Existentes'),
    Line2D([0], [0], marker='o', color='w', markerfacecolor='none',
           markeredgecolor='blue', markersize=10, label='Nuevas Ubicaciones')
]

# Añadir una leyenda común para ambos subplots
fig.legend(handles=legend_elements, loc='center right', bbox_to_anchor=(1, 0.5))

# Ajustar el espaciado
plt.tight_layout()
plt.show()

# Función para calcular la ganancia en un punto y sus vecinos
def calcular_ganancia(matriz, x, y, n=15):
    suma = 0
    for i in range(max(0, x-1), min(n, x+2)):
        for j in range(max(0, y-1), min(n, y+2)):
            suma += matriz[i, j]
    return suma

# Cálculo de ganancia existente
ganancia_existente = 0
for x, y in existentes:
    ganancia_poblacion = calcular_ganancia(poblacion, x-1, y-1)  # Ajuste de índice para matriz (0 basado)
    ganancia_empresarial = calcular_ganancia(empresarial, x-1, y-1)
    
    print(f"Ganancia en población para ({x}, {y}):", ganancia_poblacion)
    print(f"Ganancia en empresarial para ({x}, {y}):", ganancia_empresarial)
    
    ganancia_existente += ganancia_poblacion
    ganancia_existente += ganancia_empresarial

print("Ganancia existente:", ganancia_existente)

# Nuevas ubicaciones proporcionadas
nuevas_ubicaciones = [(13, 7), (14, 9), (12, 9), (11, 7)]

# Cálculo de la ganancia adicional para las nuevas ubicaciones
ganancia_nuevas = 0
for x, y in nuevas_ubicaciones:
    ganancia_poblacion = calcular_ganancia(poblacion, x - 1, y - 1)  # Ajuste para índice 0-based
    ganancia_empresarial = calcular_ganancia(empresarial, x - 1, y - 1)
    
    print(f"Ganancia en población para ({x}, {y}):", ganancia_poblacion)
    print(f"Ganancia en empresarial para ({x}, {y}):", ganancia_empresarial)
    
    ganancia_nuevas += ganancia_poblacion
    ganancia_nuevas += ganancia_empresarial

# Ganancia total
ganancia_total = ganancia_existente + ganancia_nuevas


print("Ganancia total con las nuevas ubicaciones:", ganancia_total)