# Prueba Técnica - Prodei

Este proyecto, desarrollado por **Draco**, es una aplicación React Native creada con Expo. Utiliza el API de Last FM para obtener y mostrar las canciones más escuchadas de un país específico. Además, simula procesos de reproducción y tiene una sección de perfil donde los usuarios pueden ver su historial de canciones reproducidas.

## Características

- Muestra las canciones más escuchadas de un país usando el API de Last FM.
- Simula la reproducción de música.
- Perfil de usuario con historial de reproducciones.

## Pre-requisitos

- Tener instalado [Node.js](https://nodejs.org/).
- Tener instalado [Expo CLI](https://docs.expo.dev/get-started/installation/).

## Instalación y Ejecución

1. **Clonar el Repositorio**

   ```bash
   git clone https://github.com/LuxDraco/PRODEI_RN
   cd PRODEI_RN
   ```

2. **Crear un archivo `.env` para las variables de entorno**

   Antes de ejecutar la aplicación, debes crear un archivo `.env` en la raíz del proyecto y definir la siguiente variable:

   ```env
   API_KEY=tu_api_key_de_last_fm
   ```

   Reemplaza `tu_api_key_de_last_fm` con tu clave API real de Last FM.

3. **Instalar Dependencias**

   ```bash
   npm install
   ```

4. **Ejecutar con Expo**

   ```bash
   npm start
   ```

   Esto abrirá una nueva ventana en tu navegador o en tu terminal con un código QR. Puedes escanear este código con la aplicación Expo Go en tu dispositivo móvil para ver la aplicación en acción.

## Uso

1. Al abrir la aplicación, verás una lista de las canciones más escuchadas.
2. Puedes seleccionar una canción para simular su reproducción.
3. En la sección de perfil, podrás ver tu historial de canciones reproducidas.

## Créditos

- **Draco**: Desarrollador principal de la aplicación.
- **Last FM**: Proveedor del API que alimenta la aplicación.
- **PRODEI**: Empresa facilitadora de la prueba técnica.

## Licencia

Este proyecto es de código abierto.

---
