# Empleabot Plus

**Una página de aterrizaje moderna con un chatbot integrado, desarrollada con HTML, CSS y JavaScript puro.**

---

## Contenido

- [Acerca del Proyecto](#acerca-del-proyecto)
- [Características](#caracteristicas)
- [Cómo Empezar](#como-empezar)
- [Uso](#uso)
- [Despliegue](#despliegue)
- [Personalización](#personalizacion)
- [Funcionalidad del Chatbot](#funcionalidad-del-chatbot)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Acerca del Proyecto

Empleabot Plus es una página web diseñada para facilitar la interacción con los usuarios mediante un chatbot integrado. La página es moderna, responsiva y fácil de usar, ideal para mostrar información y responder preguntas de manera automática.

## Características

- Diseño responsivo que se adapta a cualquier dispositivo.
- Chatbot integrado que se activa al hacer clic.
- Animaciones suaves para una mejor experiencia visual.
- Secciones destacadas para mostrar información importante.
- Preguntas frecuentes interactivas para resolver dudas comunes.

## Cómo Empezar

1. Clona este repositorio.
2. Instala las dependencias necesarias.
3. Ejecuta la aplicación localmente para probarla.

## Uso

Simplemente abre la página en un navegador y haz clic en el chatbot para comenzar a interactuar.

## Despliegue

### 1. Local Development Setup

For local testing, you'll use a `.env` file to store your API keys and other secrets.

**Action:** Create a file named `.env` in the root of your project with the following content. **Do not commit this file to git.**

```
FLASK_APP=main.py
FLASK_DEBUG=True
AZURE_OPENAI_KEY=<YOUR_AZURE_OPENAI_KEY>
AZURE_OPENAI_ENDPOINT=<YOUR_AZURE_OPENAI_ENDPOINT>
AZURE_OPENAI_ASSISTANT_ID=<YOUR_AZURE_OPENAI_ASSISTANT_ID>
```

Replace the `<...>` placeholders with your actual Azure OpenAI credentials.

### 2. Azure App Service Configuration

These steps are performed in the [Azure Portal](https://portal.azure.com).

**A. Create the App Service:**

1.  Click on **"Create a resource"** and search for **"Web App"**. Click **"Create"**.
2.  **Subscription:** Choose your Azure subscription.
3.  **Resource Group:** Create a new one or use an existing one.
4.  **Name:** `EmpleabotPlus` (or your preferred unique name).
5.  **Publish:** Select **"Code"**.
6.  **Runtime stack:** Select **"Python 3.12"** (or the version you are using).
7.  **Operating System:** Select **"Linux"**.
8.  **Region:** Choose a region close to you.
9.  **App Service Plan:** Create a new one or use an existing one.
10. Click **"Review + create"** and then **"Create"**.

**B. Set the Startup Command:**

Once your App Service is created, navigate to it in the Azure portal.

1.  Go to **"Configuration"** in the left menu.
2.  Select the **"General settings"** tab.
3.  In the **"Startup Command"** field, enter the following:
    ```
    gunicorn --bind=0.0.0.0 --workers=4 main:app
    ```
    This command tells Azure to start your application using the Gunicorn web server, which is specified in your `requirements.txt`.

**C. Configure Application Settings (Your API Keys):**

1.  While still in the **"Configuration"** section, go to the **"Application settings"** tab.
2.  Click **"New application setting"** and add the following key-value pairs. These will be available as environment variables to your application.

| Name | Value |
| :--- | :--- |
| `AZURE_OPENAI_KEY` | `<YOUR_AZURE_OPENAI_KEY>` |
| `AZURE_OPENAI_ENDPOINT` | `<YOUR_AZURE_OPENAI_ENDPOINT>` |
| `AZURE_OPENAI_ASSISTANT_ID` | `<YOUR_AZURE_OPENAI_ASSISTANT_ID>` |
| `FLASK_DEBUG` | `False` |

*   For the secret values, it is highly recommended to check the "Deployment slot setting" box.

### 3. GitHub Actions Deployment

Your repository already has a `.github/workflows/main_empleabotplus.yml` file, which is set up to deploy to an Azure Web App. You just need to provide it with the credentials.

**A. Get the Publish Profile from Azure:**

1.  In the Azure Portal, go to your `EmpleabotPlus` App Service.
2.  On the **"Overview"** page, click **"Get publish profile"**. This will download a `.publishsettings` file.

**B. Add the Publish Profile to GitHub Secrets:**

1.  Go to your GitHub repository.
2.  Click on **"Settings"** > **"Secrets and variables"** > **"Actions"**.
3.  Click **"New repository secret"**.
4.  For the **"Name"**, use the name that is in your `main_empleabotplus.yml` file: `AZUREAPPSERVICE_PUBLISHPROFILE_49932B91B4A642A284C008C5BE307340`
5.  For the **"Value"**, open the `.publishsettings` file you downloaded and copy the entire contents into the value field.
6.  Click **"Add secret"**.

### 4. Deploy!

Your GitHub Actions workflow is configured to run on every push to the `main` branch. To deploy your application, simply push your latest changes to the `main` branch.

You can monitor the progress of the deployment in the **"Actions"** tab of your GitHub repository.

Once the workflow is complete, your application will be deployed and accessible at the URL provided by the App Service (e.g., `https://empleabotplus.azurewebsites.net`).

## Personalización

Puedes cambiar colores, imágenes y textos para adaptar la página a tus necesidades.

## Funcionalidad del Chatbot

El chatbot está diseñado para responder preguntas frecuentes y ayudar a los usuarios de forma automática, mejorando la experiencia de navegación.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para mejorar el proyecto.

## Licencia

Este proyecto está bajo la licencia MIT.

## Contacto

Para más información, contacta al desarrollador.