# Empleabot Plus

**A modern landing page with a built-in chatbot bubble, developed with HTML, CSS, and vanilla JavaScript.**

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fyour-username%2Fyour-repo-name%2Fmain%2Fazure-deploy.json)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Customization](#customization)
  - [Colors and Theme](#colors-and-theme)
  - [Chatbot](#chatbot)
  - [Logos and Images](#logos-and-images)
- [Chatbot Functionality](#chatbot-functionality)
- [React Integration](#react-integration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About the Project

This project is a modern and responsive landing page for "Digital Skills for the Workplace." It features a clean design and a chatbot bubble that expands on click, providing an interactive user experience.

## Features

- **Responsive Design:** Looks great on all devices.
- **Chatbot Bubble:** Expands on click to reveal a chat interface.
- **Smooth Animations:** CSS transitions and animations for a polished feel.
- **Interactive FAQ:** Accordion-style frequently asked questions.
- **Featured Sections:** Information cards to highlight key content.
- **Icon Support:** Uses Feather Icons for a clean and modern look.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, etc.)
- A code editor (VS Code, Sublime Text, etc.)
- [Git](https://git-scm.com/)
- [Python](https://www.python.org/)

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Create a virtual environment**
   ```sh
   python -m venv .venv
   ```

3. **Activate the virtual environment**
   - **Windows**
     ```sh
     .venv\Scripts\activate
     ```
   - **macOS/Linux**
     ```sh
     source .venv/bin/activate
     ```

4. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```

5. **Run the Flask server**
   ```sh
   python application.py
   ```

The site will be available at `http://localhost:5000`.

## Usage

Once the server is running, you can open the `index.html` file in your browser to see the landing page. The chatbot can be customized to answer specific questions by modifying the `script.js` file.

## Deployment

This is a static application that can be deployed to any web server. Here are a few options:

- **GitHub Pages:** Deploy a static site for free.
- **Netlify:** A popular choice for deploying static sites.
- **Vercel:** Another great option for deploying static sites.
- **Azure App Service:**
  1. Zip all the files in the project.
  2. In the Azure Portal, go to your App Service.
  3. Select "Deployment Center" > "External" > "Import ZIP file".
  4. Upload the ZIP file.

## Customization

### Colors and Theme

You can easily change the color scheme by editing the CSS variables at the top of the `styles.css` file:

```css
:root {
    --primary-color: #07403F;
    --secondary-color: #00B19A;
    --highlight-color: #00B19A;
    /* other variables */
}
```

### Chatbot

To customize the chatbot:

- **Modify the predefined responses** in the `script.js` file.
- **Change the avatar image** in the `.chatbot-bubble` class in the HTML.
- **Adjust the chatbot's style** by modifying the corresponding classes in the CSS.

### Logos and Images

Replace the files in the `attached_assets` folder with your own, keeping the original file names, or update the paths in the HTML.

## Chatbot Functionality

The chatbot is a simple simulation that responds to specific keywords:

1. Questions about CVs or resumes
2. Interview tips
3. Information about recommended courses
4. Information about Artificial Intelligence

To integrate a real chatbot, modify the `getBotResponse()` function in `script.js` to connect to an external API.

## React Integration

To convert this project to React:

1. **Create a new React project**
   ```sh
   npx create-react-app empleabot-landing
   cd empleabot-landing
   ```

2. **Install the necessary dependencies**
   ```sh
   npm install react-feather
   ```

3. **Structure the components**
   - `Header`
   - `Hero`
   - `Features`
   - `Questions`
   - `Footer`
   - `ChatBot`

4. **Convert the CSS to CSS modules or use styled-components.**

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/your-repo-name](https://github.com/your-username/your-repo-name)