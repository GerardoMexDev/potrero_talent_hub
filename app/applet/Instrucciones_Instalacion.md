# Guía de Instalación - Futbol Tracker

## 1. Requisitos Previos
Para poder ejecutar este proyecto, es necesario tener instalado **Node.js** en la computadora.
- Descárgalo gratis desde: https://nodejs.org/ (Se recomienda la versión LTS).

## 2. Descargar el Proyecto
- Si aún no lo has hecho, descarga el proyecto en formato ZIP desde la plataforma y descomprímelo en una carpeta de tu computadora.

## 3. Instalación (Modo Desarrollo / Pruebas)
Sigue estos pasos para probar la web en tu propia computadora:
1. Abre una terminal (Símbolo del sistema, PowerShell o la terminal de VS Code).
2. Navega hasta la carpeta donde descomprimiste el proyecto:
   `cd ruta/hacia/la/carpeta/del/proyecto`
3. Instala las dependencias necesarias ejecutando:
   `npm install`
4. Inicia el servidor de prueba ejecutando:
   `npm run dev`
5. Abre tu navegador web y visita el enlace que aparece en la terminal (generalmente `http://localhost:5173`).

## 4. Preparación para el Cliente (Modo Producción)
Cuando el proyecto esté listo para ser publicado en internet (en un hosting como Hostinger, Vercel, Netlify, cPanel, etc.), debes generar la versión optimizada:
1. Abre la terminal en la carpeta del proyecto.
2. Ejecuta el siguiente comando:
   `npm run build`
3. Esto creará una nueva carpeta llamada **`dist`**.
    
**¡Importante!** La carpeta `dist` contiene el producto final optimizado. Es la ÚNICA carpeta que el cliente necesita subir a su servidor web para que la página esté pública en internet.

---
*© Copyright PixelVivo 2026. Todos los derechos reservados.*
