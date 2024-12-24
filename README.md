# Proyecto: Ubicación Óptima de Nuevos Programas de Ingeniería de Sistemas

## Integrantes

- **Alejandro Marin Hoyos** - 2259353-3743
- **Yessica Fernanda Villa Nuñez** - 2266301-3743
- **Manuel Antonio Vidales Duran** - 2155481-3743
## Introducción

Estás trabajando en la sede **High Beach**, donde se te ha encomendado resolver el problema de ubicación óptima de nuevos programas de Ingeniería de Sistemas. La candidata **Vaki Cabila** ha solicitado tu ayuda para maximizar el impacto de las nuevas extensiones del programa, asegurándose de que:

1. Las nuevas localizaciones estén alejadas de las existentes.
2. Las localizaciones seleccionadas tengan un segmento de población significativo.
3. Existan condiciones favorables en el entorno empresarial del municipio seleccionado.

Como estudiante experto en **modelado matemático, programación y ciencias oscuras**, has desarrollado un sistema que optimiza las ubicaciones de los nuevos programas utilizando matrices de segmentos de población y entorno empresarial.

## Descripción del Problema

El país se modela como un plano cartesiano de tamaño `n x n`. Las localizaciones actuales de los programas son:

| Sede        | x  | y  |
|-------------|----|----|
| Cali        | 6  | 8  |
| Tulua       | 8  | 4  |
| Caicedonia  | 10 | 10 |

Las restricciones para las nuevas ubicaciones son:

1. **No contigüdad:** Los nuevos programas no pueden ser contiguos a las localizaciones actuales.
2. **Segmento de población:** La suma del segmento en la nueva ubicación y sus contiguas debe ser al menos 25.
3. **Entorno empresarial:** La suma del entorno empresarial en la nueva ubicación y sus contiguas debe ser al menos 20.

## Requisitos del Proyecto

Este proyecto utiliza las siguientes tecnologías y herramientas:

- **Node.js**: Para correr los tests y el servidor.
- **MiniZinc**: Para resolver el modelo matemático de optimización.
- **Gecode**: Solver utilizado por MiniZinc.

## Instalación y Configuración

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/jessvilla1975/SistemasInfinito.git

```

### Paso 2: Instalar dependencias

Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
npm install
```

### Paso 3: Instalar MiniZinc

Asegúrate de tener **MiniZinc** y el solver **Gecode** instalados. Consulta la [documentación oficial de MiniZinc](https://www.minizinc.org/software.html) para más detalles.

### Paso 4: Configurar el servidor

El servidor está configurado para correr en el puerto `3000`. 

## Uso del Proyecto

### Ejecutar los Tests

Ejecuta el siguiente comando para correr las pruebas automáticas:

```bash
npm run test
```

### Resolver una Instancia del Problema

1. Define los datos del problema en un archivo `data.dzn`.
2. Usa el siguiente comando para resolver el problema con MiniZinc:

```bash
minizinc --solver Gecode models/ubicacion.mzn temp/data.dzn
```

### Ejecutar el Servidor

Inicia el servidor con el siguiente comando:

```bash
npm start
```

Accede a la aplicación en [http://localhost:3000](http://localhost:3000).

### Subir un Archivo de Ejemplo

Puedes cargar un archivo de datos (por ejemplo, `ejemplo.txt`) desde la interfaz del servidor para probar diferentes configuraciones.

## Ejemplo de Datos

### Segmento de Población
```
4 0 1 1 2 2 0 0 4 15 15 4 11 2 1
4 0 3 1 6 2 0 0 4 15 15 4 8 2 1
...
```

### Entorno Empresarial
```
0 0 1 1 2 2 4 13 4 16 16 4 2 6 2
0 0 1 1 2 2 4 13 4 16 16 4 2 6 2
...
```


**Resolviendo problemas al infinito y más allá: Ingeniería de Sistemas al ∞**
