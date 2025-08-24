# Front‑End Overview

## Estructura del proyecto

```
templates/
├─ index.html          # Página principal con el widget de chat
static/
├─ css/
│   ├─ custom.css
│   └─ chat-bubble.css
├─ js/
│   ├─ chat.js
│   └─ main.js
```

- **`templates/index.html`** contiene la estructura HTML y enlaza los estilos y scripts estáticos.
- Los archivos CSS en `static/css` definen el estilo del widget y la página.
- Los scripts en `static/js` manejan la lógica del chat y la interacción con el backend.

## Funcionamiento

1. **Carga inicial** – Al abrir la página se cargan los estilos y los scripts.
2. **Botón flotante** – Al hacer clic en el botón flotante se muestra el widget de chat.
3. **Formulario de chat** – El usuario escribe un mensaje y lo envía. El script `chat.js` envía la petición al backend y muestra la respuesta.
4. **Adjuntar archivos** – Se puede adjuntar un PDF mediante el input de tipo `file`.

## Cómo usarlo

1. Ejecuta el servidor Flask (por ejemplo `python app.py`).
2. Navega a `http://localhost:5000`.
3. Interactúa con el widget de chat.

---

Para más detalles, revisa el código fuente en los archivos mencionados.
