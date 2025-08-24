# Documentación de app.py

Este archivo `app.py` es una aplicación web construida con Flask que permite interactuar con un asistente basado en Azure OpenAI. A continuación se explica cómo funciona y sus componentes principales.

## Configuración inicial

- Carga variables de entorno desde un archivo `.env` para configurar la conexión con Azure OpenAI y la sesión.
- Configura un cliente de Azure OpenAI si las variables necesarias están presentes, de lo contrario entra en modo local de desarrollo (simulación).
- Define una carpeta para subir archivos PDF y permite solo archivos con extensión `.pdf`.

## Rutas principales

### `/`
- Renderiza la página principal `index.html`.

### `/chat` (POST)
- Recibe mensajes del usuario y opcionalmente un archivo PDF.
- Si se recibe un PDF, extrae el texto y lo añade al mensaje del usuario.
- En modo local, responde con un CV simulado en formato HTML.
- En modo producción, envía el mensaje al asistente Azure OpenAI y espera la respuesta.
- Devuelve la respuesta del asistente en formato JSON.

### `/health`
- Endpoint para verificar el estado de la aplicación.
- Devuelve información sobre si está en modo local, si la configuración de Azure está completa y la ruta de la carpeta de uploads.

## Funciones auxiliares

- `allowed_file(filename)`: Verifica que el archivo tenga extensión permitida.
- `get_or_create_thread()`: Obtiene o crea un hilo de conversación para mantener el contexto entre mensajes.

## Ejecución

- La aplicación corre en el puerto 5000 por defecto o el puerto definido en la variable de entorno `PORT`.
- El modo debug está activado para facilitar el desarrollo.

---

Esta documentación proporciona una visión general para entender cómo funciona `app.py` y cómo interactuar con la aplicación.
