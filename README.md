# Landing Page - Habilidades Digitales para el Ámbito Laboral

Una landing page con diseño moderno y un chatbot integrado en forma de burbuja, desarrollada con HTML, CSS y JavaScript puro.

## Características

- Diseño responsivo para todos los dispositivos
- Chatbot en forma de burbuja que se expande al hacer clic
- Animaciones y transiciones suaves
- Preguntas frecuentes con interactividad
- Secciones destacadas con tarjetas informativas
- Soporte para íconos a través de Feather Icons

## Estructura del Proyecto

```
├── index.html       # Estructura HTML principal
├── styles.css       # Estilos CSS
├── script.js        # Funcionalidad JavaScript
└── attached_assets/ # Imágenes y logotipos
    ├── logo1.png
    ├── logo2.png
    ├── Logo 3.png
    └── robotsite.png
```

## Instalación y Despliegue

1. **Clona el repositorio**

```bash
git clone <url-del-repositorio>
cd <nombre-carpeta>
```

2. **Para desarrollo local**

Simplemente abre el archivo `index.html` en tu navegador o utiliza un servidor local:

```bash
# Usando Python
python -m http.server

# O con npm
npx serve
```

3. **Para despliegue en producción**

Esta es una aplicación estática que puede desplegarse en cualquier servidor web:

- Copia todos los archivos al directorio raíz de tu servidor web
- Para Azure App Service, sigue estos pasos:
  - Comprime todos los archivos en un archivo ZIP
  - En Azure Portal, ve a tu App Service
  - Selecciona "Deployment Center" > "External" > "Importar archivo ZIP"
  - Sube el archivo ZIP

## Personalización

### Colores y Tema

Puedes modificar los colores y variables principales editando las variables CSS en la parte superior del archivo `styles.css`:

```css
:root {
    --primary-color: #07403F;
    --secondary-color: #00B19A;
    --highlight-color: #00B19A;
    /* otras variables */
}
```

### Chatbot

Para personalizar el chatbot:
- Modifica las respuestas predefinidas en `script.js`
- Cambia la imagen del avatar en la clase `.chatbot-bubble` en HTML
- Ajusta el estilo del chatbot modificando las clases correspondientes en CSS

### Logotipos e Imágenes

Reemplaza los archivos en la carpeta `attached_assets` manteniendo los nombres de archivo originales, o actualiza las rutas en el HTML.

## Funcionalidades del Chatbot

El chatbot implementado es una simulación simple que responde a palabras clave específicas:

1. Preguntas sobre CV o currículum
2. Consejos para entrevistas
3. Información sobre cursos recomendados
4. Información sobre Inteligencia Artificial

Para integrar un chatbot real, modifica la función `getBotResponse()` en `script.js` para conectarte a una API externa.

## Integración con React

Para convertir este proyecto a React:

1. Crea un nuevo proyecto React:
```bash
npx create-react-app empleabot-landing
cd empleabot-landing
```

2. Instala las dependencias necesarias:
```bash
npm install react-feather
```

3. Estructura los componentes:
   - Header
   - Hero
   - Features
   - Questions
   - Footer
   - ChatBot

4. Convierte los estilos CSS a módulos CSS o utiliza styled-components.

## Soporte

Para preguntas o problemas, por favor abre un issue en el repositorio o contacta al equipo de desarrollo.

## Licencia

[MIT](LICENSE) 