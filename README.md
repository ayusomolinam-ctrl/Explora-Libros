# Explora Libros

## Nombre y descripción del proyecto

**Explora Libros** es una aplicación web desarrollada como proyecto académico para la materia de Desarrollo de Aplicaciones Web. Su propósito es facilitar la búsqueda de libros por título o autor y presentar información básica de cada resultado, como la portada, el nombre de la obra, sus autores y el año de primera publicación.

La aplicación obtiene información actualizada mediante la API pública de Open Library y permite abrir la ficha oficial de cada obra cuando existe un identificador válido.

## Tecnologías utilizadas

- **HTML5:** estructura semántica y accesible de la interfaz.
- **CSS3:** diseño visual, estados interactivos y adaptación a distintos tamaños de pantalla.
- **JavaScript:** consultas a la API, validaciones, manejo de errores y creación dinámica de resultados.
- **API de Open Library:** fuente pública de información bibliográfica y portadas.
- **Git:** control de versiones del proyecto.
- **GitHub:** alojamiento y publicación del repositorio.
- **Visual Studio Code:** edición y organización de los archivos del proyecto.

## Características principales

- Búsqueda de libros por título o autor.
- Presentación de hasta 12 resultados por consulta.
- Tarjetas con portada, título, autor y año de primera publicación.
- Alternativas comprensibles cuando un libro no tiene portada, autor, año o ficha válida.
- Botón **«Ver libro»** para abrir la ficha oficial de la obra en Open Library.
- Diseño responsive para computadoras y dispositivos móviles.
- Validación del campo de búsqueda y protección contra consultas simultáneas.
- Mensajes de carga, resultados vacíos y problemas de conexión.
- Manejo de errores HTTP, incluido el límite de peticiones HTTP 429.

## API utilizada

El proyecto utiliza la API pública de búsqueda de Open Library:

```text
https://openlibrary.org/search.json
```

JavaScript obtiene el texto escrito por el usuario, lo codifica para incluirlo de forma segura en la dirección de consulta y realiza la petición mediante `fetch()`. La función de búsqueda utiliza `async/await` para esperar la respuesta y procesar los datos recibidos en formato JSON.

La API proporciona los datos empleados para crear las tarjetas, como el título, los autores, el año de primera publicación, el identificador de portada y la clave de la obra. Para este tipo de consulta pública no se necesita una clave de API.

## Instrucciones para ejecutar la aplicación

### 1. Descargar o clonar el repositorio

El proyecto puede descargarse desde GitHub como archivo ZIP o clonarse con Git:

```bash
git clone https://github.com/ayusomolinam-ctrl/Explora-Libros.git
```

### 2. Abrir el proyecto en Visual Studio Code

Después de descargar o clonar el repositorio, se debe abrir la carpeta `Explora-Libros` desde Visual Studio Code mediante la opción **Archivo > Abrir carpeta**.

### 3. Iniciar la aplicación

Con la extensión **Live Server** instalada en Visual Studio Code:

1. Abrir el archivo `index.html`.
2. Hacer clic derecho dentro del archivo.
3. Seleccionar **Open with Live Server**.
4. Esperar a que la aplicación se abra en el navegador.

La aplicación necesita conexión a internet para consultar Open Library y cargar las portadas disponibles.

## Uso de inteligencia artificial

Durante el desarrollo del proyecto utilicé herramientas de inteligencia artificial como apoyo:

- **Codex:** para generar código, revisar errores y aplicar correcciones en los archivos del proyecto.
- **ChatGPT:** para organizar el trabajo, preparar instrucciones o prompts, comprender el funcionamiento del código, planificar las pruebas y preparar la documentación.

Las respuestas generadas fueron revisadas antes de incorporarse al proyecto.

## Trabajo realizado personalmente

Mi participación personal en el proyecto incluyó:

- Elegir el tema y definir las funcionalidades de la aplicación.
- Crear y organizar la estructura del proyecto.
- Probar la aplicación en el navegador.
- Revisar los resultados de búsqueda y los mensajes de error.
- Comprobar el diseño en vista móvil.
- Gestionar los commits y la publicación del proyecto en GitHub.

## Enlace al repositorio

[https://github.com/ayusomolinam-ctrl/Explora-Libros](https://github.com/ayusomolinam-ctrl/Explora-Libros)
