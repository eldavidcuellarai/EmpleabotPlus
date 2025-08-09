document.addEventListener('DOMContentLoaded', function() {
    feather.replace();

    // Chat bubble elements
    const chatBubble = document.getElementById('chatbot-bubble');
    const chatPanel = document.getElementById('chatbot-panel');
    const closeBtn = document.getElementById('close-chatbot');
    const expandBtn = document.getElementById('expand-chatbot');
    const messagesContainer = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    const fileUploadBtn = document.getElementById('file-upload-btn');
    const fileUploadInput = document.getElementById('file-upload');
    
    // Ensure marked is properly initialized
    console.log("Marked library availability:", typeof marked !== 'undefined');
    
    // Set up markdown options if the library is available
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true
        });
    }
    
    // Find and remove the welcome message entirely
    const welcomeMessage = messagesContainer.querySelector('.message.bot');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    // Add bubble mode class for better styling control
    chatPanel.classList.add('chatbot-bubble-mode');
    
    // Empleabot categories container elements
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'empleabot-categories';
    messagesContainer.after(categoryContainer);

    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = 'Comparte tu CV y selecciona el área que quieres mejorar';
    categoryContainer.appendChild(categoryTitle);

    const buttonGrid = document.createElement('div');
    buttonGrid.className = 'button-grid';
    categoryContainer.appendChild(buttonGrid);

    // Questions for each category with icons
    const categoryQuestions = {
        'Revisión General': [
            {text: '¿Qué errores comunes debo evitar en mi CV?', icon: 'alert-triangle'},
            {text: '¿Puedes revisar mi CV y decirme qué debería mejorar?', icon: 'search'},
            {text: 'Necesito actualizar mi CV después de 5 años', icon: 'refresh-cw'},
            {text: '¿Cómo reducir mi CV a una página sin perder impacto?', icon: 'minimize-2'},
            {text: '¿Dónde coloco mis nuevos cursos y certificaciones en el CV?', icon: 'award'}
        ],
        'Adaptación por Perfil': [
            {text: '¿Cómo enfoco mi CV para conseguir trabajo en tecnología?', icon: 'code'},
            {text: '¿Cómo ajustar mi CV para diferentes roles?', icon: 'shuffle'},
            {text: 'Adaptar CV al sector tecnológico', icon: 'cpu'},
            {text: 'Quiero cambiar de sector, ¿cómo adapto mi experiencia?', icon: 'refresh-ccw'}
        ],
        'Primeros Empleos': [
            {text: '¿Qué pongo en mi CV si no tengo experiencia profesional?', icon: 'file-plus'},
            {text: '¿Cómo destacar prácticas universitarias en mi primer CV?', icon: 'book'},
            {text: '¿Cómo puedo usar mis proyectos de la universidad como experiencia laboral?', icon: 'folder'},
            {text: 'Tengo experiencia como voluntario, ¿cómo la incluyo en mi CV?', icon: 'heart'},
            {text: '¿Cómo incluyo mis trabajos informales en un CV profesional?', icon: 'briefcase'},
            {text: 'Aprendí programación/diseño por mi cuenta, ¿cómo lo muestro en mi CV?', icon: 'code'}
        ],
        'Habilidades y Competencias': [
            {text: '¿Qué habilidades blandas debo incluir en mi CV?', icon: 'users'},
            {text: '¿Cómo demostrar habilidades de liderazgo en mi CV?', icon: 'star'},
            {text: '¿Cómo equilibrar habilidades técnicas y blandas en mi CV?', icon: 'git-merge'},
            {text: '¿Cómo redactar un resumen profesional impactante?', icon: 'edit'},
            {text: '¿Cómo presentar certificaciones y formación para maximizar su impacto?', icon: 'award'}
        ]
    };

    // Icons for each category
    const categoryIcons = {
        'Revisión General': 'refresh-cw',
        'Adaptación por Perfil': 'target',
        'Primeros Empleos': 'briefcase',
        'Habilidades y Competencias': 'star'
    };

    // Category descriptions
    function getCategoryDescription(category) {
        switch(category) {
            case 'Revisión General':
                return 'Actualizar, mejorar, optimizar';
            case 'Adaptación por Perfil':
                return 'Cambio de sector, roles específicos';
            case 'Primeros Empleos':
                return 'Sin experiencia, recién graduados';
            case 'Habilidades y Competencias':
                return 'Destacar capacidades clave';
            default:
                return '';
        }
    }

    // Show questions for a specific category
    function showCategoryQuestions(category) {
        // Update category title
        categoryTitle.textContent = category;

        // Clear existing buttons and add questions-grid class
        buttonGrid.innerHTML = '';
        buttonGrid.classList.add('questions-grid');

        // Add back button
        const backButton = document.createElement('div');
        backButton.className = 'action-button back-button';
        backButton.innerHTML = '<h3>← Volver</h3>';
        backButton.addEventListener('click', showMainCategories);
        buttonGrid.appendChild(backButton);

        // Add question buttons
        categoryQuestions[category].forEach(question => {
            const questionButton = document.createElement('div');
            questionButton.className = 'action-button question-button';
            questionButton.innerHTML = `
                <i data-feather="${question.icon}" class="question-icon"></i>
                <h3>${question.text}</h3>
            `;
            questionButton.addEventListener('click', () => {
                userInput.value = question.text;
                userInput.focus();
                sendMessage(question.text);
                showMainCategories();
            });
            buttonGrid.appendChild(questionButton);
        });

        // Initialize Feather icons for the new buttons
        feather.replace();
    }

    // Show main categories
    function showMainCategories() {
        // Update title to default
        categoryTitle.textContent = 'Comparte tu CV y selecciona el área que quieres mejorar';

        // Remove questions grid class
        buttonGrid.classList.remove('questions-grid');

        // Clear and restore main category buttons
        buttonGrid.innerHTML = '';
        
        Object.entries(categoryQuestions).forEach(([category, _]) => {
            const categoryButton = document.createElement('div');
            categoryButton.className = 'action-button';
            categoryButton.innerHTML = `
                <i data-feather="${categoryIcons[category]}" class="category-icon"></i>
                <h3>${category}</h3>
                <p>${getCategoryDescription(category)}</p>
            `;
            categoryButton.addEventListener('click', function() {
                showCategoryQuestions(category);
            });
            buttonGrid.appendChild(categoryButton);
        });

        // Initialize icons
        feather.replace();
    }

    // Initialize with main categories
    showMainCategories();

    // Minimize/Maximize/Close chat panel
    chatBubble.addEventListener('click', function() {
        chatPanel.classList.add('active');
        chatPanel.classList.remove('chatbot-bubble-mode');
        messagesContainer.classList.add('expanded');
        
        // Asegurar que el input sea visible
        setTimeout(() => {
            userInput.focus();
            // Scroll al final del contenedor de mensajes para asegurar que todo esté visible
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 300);
        
        // Reload Feather icons in case they didn't load properly
        feather.replace();
    });
    
    closeBtn.addEventListener('click', function() {
        chatPanel.classList.remove('active');
        chatPanel.classList.remove('fullscreen');
        chatPanel.classList.add('chatbot-bubble-mode');
        messagesContainer.classList.remove('expanded');
        
        // Change icon back to maximize-2
        expandBtn.innerHTML = '<i data-feather="maximize-2"></i>';
        feather.replace();
    });
    
    expandBtn.addEventListener('click', function() {
        if (chatPanel.classList.contains('fullscreen')) {
            chatPanel.classList.remove('fullscreen');
            expandBtn.innerHTML = '<i data-feather="maximize-2"></i>';
        } else {
            chatPanel.classList.add('fullscreen');
            expandBtn.innerHTML = '<i data-feather="minimize-2"></i>';
        }
        feather.replace();
    });

    // Handle file uploads
    fileUploadBtn.addEventListener('click', function() {
        fileUploadInput.click();
    });
    
    fileUploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Verify it's a PDF file
            if (file.type !== 'application/pdf') {
                const errorElement = document.createElement('div');
                errorElement.classList.add('message', 'bot', 'error');
                errorElement.innerHTML = `<p>Por favor, sube solo archivos PDF.</p>`;
                messagesContainer.appendChild(errorElement);
                // Clear the selection
                fileUploadInput.value = '';
                return;
            }
            
            // Show the selected file in the chat
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('message', 'file');
            userMessageElement.innerHTML = `
                <div class="file-info">
                    <i data-feather="file" class="file-icon"></i>
                    <span class="file-name">${file.name}</span>
                </div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            `;
            messagesContainer.appendChild(userMessageElement);
            feather.replace();
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Ask the user about the CV
            const askElement = document.createElement('div');
            askElement.classList.add('message', 'bot');
            askElement.innerHTML = `<p>He recibido tu CV. ¿Qué te gustaría saber sobre él? Por ejemplo, puedes preguntarme cómo mejorarlo, adaptar el contenido a una industria específica, o pedir consejos sobre secciones concretas.</p>`;
            messagesContainer.appendChild(askElement);
            
            // Send the file to the server
            sendMessage('Por favor, analiza este CV y dame consejos para mejorarlo.', file);
            
            // Clear the selection to allow selecting the same file again
            fileUploadInput.value = '';
        }
    });
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Send button click handler
    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
        }
    });

    // Enter key press handler
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                sendMessage(message);
            }
        }
    });

    // Function to send a message
    function sendMessage(message, file = null) {
        if (!message.trim() && !file) return;
        
        // Clear suggestions if any
        const suggestions = document.querySelector('.suggested-questions');
        if (suggestions) {
            suggestions.remove();
        }

        // Move categories out of view
        categoryContainer.style.display = 'none';
        
        // Show messages container if it was hidden
        messagesContainer.style.display = 'block';
        
        if (message.trim()) {
            // Add user message to chat
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('message', 'user');
            userMessageElement.innerHTML = `<p>${message}</p>`;
            messagesContainer.appendChild(userMessageElement);
            
            // Clear input field
            userInput.value = '';
            
            // Hide the category container when a message is sent
            categoryContainer.classList.add('hidden');
            
            // Asegurar que el input esté visible y con el foco
            setTimeout(() => {
                userInput.focus();
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Show loading indicator
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('message', 'bot', 'loading');
        loadingElement.innerHTML = `<p>Pensando...</p>`;
        messagesContainer.appendChild(loadingElement);
        
        // Scroll to show the loading indicator
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Connect to the real API
        const formData = new FormData();
        formData.append('message', message);
        
        // Add file if it exists
        if (file) {
            formData.append('file', file);
        }
        
        console.log("Sending message to API:", message);
        
        // Set a timeout to handle very slow responses
        const timeoutId = setTimeout(() => {
            console.log("Request is taking too long");
            // Only show this if loading indicator is still present
            if (loadingElement.parentNode === messagesContainer) {
                const timeoutMessage = document.createElement('div');
                timeoutMessage.classList.add('message', 'bot');
                timeoutMessage.innerHTML = `<p>La respuesta está tardando más de lo esperado. Por favor, espera un momento...</p>`;
                messagesContainer.appendChild(timeoutMessage);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 10000); // 10 segundos
        
        fetch('/chat', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {
            // Remove loading indicator
            if (loadingElement.parentNode === messagesContainer) {
                messagesContainer.removeChild(loadingElement);
            }
            
            if (response.response) {
                let botResponse = response.response;
                
                // Separate suggestions from main response
                const suggestionSeparator = '--- SUGGESTIONS ---';
                let mainResponse = botResponse;
                let suggestionsHTML = '';

                if (botResponse.includes(suggestionSeparator)) {
                    const parts = botResponse.split(suggestionSeparator);
                    mainResponse = parts[0].trim();
                    const suggestionsText = parts[1].trim();

                    if (suggestionsText) {
                        const suggestions = suggestionsText
                            .split('\n')
                            .map(line => line.trim().replace(/^-/,'').trim())
                            .filter(line => line);

                        if (suggestions.length > 0) {
                            suggestionsHTML = '<div class="suggested-questions-container">';
                            suggestions.forEach(text => {
                                suggestionsHTML += `<button class="suggested-question-chip" onclick="sendSuggestion('${text.replace(/'/g, "\\'")}')">${text}</button>`;
                            });
                            suggestionsHTML += '</div>';
                        }
                    }
                }

                // Render main response and suggestions
                const botMessageElement = document.createElement('div');
                botMessageElement.classList.add('message', 'bot');
                botMessageElement.innerHTML = `<div class="bot-bubble">${marked.parse(mainResponse)}</div>`;
                
                if (suggestionsHTML) {
                    botMessageElement.innerHTML += suggestionsHTML;
                }

                messagesContainer.appendChild(botMessageElement);
            }
            
            // Scroll to bottom after a short delay to ensure all content is rendered
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        })
        .catch(error => {
            console.error('Error sending message:', error);
            // Fallback response for network or server errors
            const errorElement = document.createElement('div');
            errorElement.classList.add('message', 'bot', 'error');
            errorElement.innerHTML = `<p>Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.</p>`;
            messagesContainer.appendChild(errorElement);
        })
        .finally(() => {
            // Re-enable input and hide typing indicator
            hideTypingIndicator();
            userInput.disabled = false;
            sendButton.disabled = false;
            fileUploadInput.disabled = false;
        });
    }

    // Helper function to send a suggestion
    window.sendSuggestion = function(text) {
        sendMessage(text);
    }

    function addBotMessage(content) {
        const botMessageElement = document.createElement('div');
        botMessageElement.classList.add('message', 'bot');
        
        // Simplify detection of suggestions section
        // Just look for the "---" marker followed by "Sugerencias" text
        const separatorIndex = content.indexOf("---");
        const hasSuggestionsSection = separatorIndex !== -1 && 
                                     content.substring(separatorIndex).includes("**Sugerencias:**");
        
        console.log("Has suggestions section:", hasSuggestionsSection, "Separator index:", separatorIndex);
        
        if (hasSuggestionsSection && separatorIndex > 0) {
            // Split content at the separator
            const mainResponse = content.substring(0, separatorIndex).trim();
            const suggestionsContent = content.substring(separatorIndex).trim();
            
            console.log("Main response length:", mainResponse.length);
            console.log("Suggestions content:", suggestionsContent);
            
            // Create container for structured content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            // Add main content
            const mainContentDiv = document.createElement('div');
            mainContentDiv.className = 'main-content';
            
            // Render main content with markdown
            try {
                if (window.renderMarkdown) {
                    mainContentDiv.classList.add('markdown-content');
                    mainContentDiv.innerHTML = window.renderMarkdown(mainResponse);
                } else if (typeof marked !== 'undefined') {
                    mainContentDiv.classList.add('markdown-content');
                    mainContentDiv.innerHTML = marked.parse(mainResponse);
                } else {
                    mainContentDiv.innerHTML = `<p>${mainResponse}</p>`;
                }
            } catch (error) {
                console.error("Error rendering main content:", error);
                mainContentDiv.innerHTML = `<p>${mainResponse}</p>`;
            }
            
            contentDiv.appendChild(mainContentDiv);
            
            // Add suggestions section with special styling
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'suggestions-section';
            
            // Render suggestions with markdown
            try {
                if (window.renderMarkdown) {
                    suggestionsDiv.classList.add('markdown-content');
                    suggestionsDiv.innerHTML = window.renderMarkdown(suggestionsContent);
                } else if (typeof marked !== 'undefined') {
                    suggestionsDiv.classList.add('markdown-content');
                    suggestionsDiv.innerHTML = marked.parse(suggestionsContent);
                } else {
                    suggestionsDiv.innerHTML = formatSuggestions(suggestionsContent);
                }
            } catch (error) {
                console.error("Error rendering suggestions:", error);
                suggestionsDiv.innerHTML = formatSuggestions(suggestionsContent);
            }
            
            // Add click handlers to suggestion links
            setTimeout(() => {
                const suggestionLinks = suggestionsDiv.querySelectorAll('a');
                console.log("Found suggestion links:", suggestionLinks.length);
                
                suggestionLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const question = this.textContent.trim();
                        console.log("Suggestion clicked:", question);
                        userInput.value = question;
                        userInput.focus();
                        sendMessage(question);
                    });
                });
            }, 100);
            
            contentDiv.appendChild(suggestionsDiv);
            botMessageElement.appendChild(contentDiv);
        } else {
            // No suggestions section, just render the full content
            try {
                if (window.renderMarkdown) {
                    // Aplicamos la clase markdown-content al contenedor de texto
                    botMessageElement.classList.add('markdown-content');
                    botMessageElement.innerHTML = window.renderMarkdown(content);
                } else if (typeof marked !== 'undefined') {
                    botMessageElement.classList.add('markdown-content');
                    botMessageElement.innerHTML = marked.parse(content);
                } else {
                    botMessageElement.innerHTML = `<p>${content}</p>`;
                }
            } catch (error) {
                console.error("Error rendering content:", error);
                botMessageElement.innerHTML = `<p>${content}</p>`;
            }
        }
        
        // Add to chat container
        messagesContainer.appendChild(botMessageElement);
    }
    
    // Function to handle suggested questions
    function formatSuggestions(content) {
        const suggestedQuestionsContainer = document.querySelector('.suggested-questions-container');
        if (suggestedQuestionsContainer) {
            suggestedQuestionsContainer.innerHTML = '';
            
            // Extract questions from the format "**1.** Question text"
            const questions = content.match(/\*\*(.*?)\*\*\s(.*?)(?=\n\*\*|$)/g);
            
            if (questions) {
                questions.forEach((q, index) => {
                    const questionText = q.replace(/\*\*(.*?)\*\*\s/, '');
                    const chip = document.createElement('button');
                    chip.className = 'suggested-question-chip';
                    
                    // Add a number span and a text span
                    chip.innerHTML = `<span class="question-number">${index + 1}</span><span class="question-full-text">${questionText}</span>`;
                    
                    chip.addEventListener('click', () => {
                        userInput.value = questionText;
                        userInput.focus();
                        sendMessage(questionText);
                    });
                    
                    suggestedQuestionsContainer.appendChild(chip);
                });
            }
        }
    }

    // Fallback responses when server is not available
    function getBotFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hola') || lowerMessage.includes('buenas') || lowerMessage.includes('saludos')) {
            return '¡Hola! Soy tu asistente para mejorar tu CV. ¿En qué área específica necesitas ayuda?';
        }
        
        if (lowerMessage.includes('cv') || lowerMessage.includes('curriculum') || lowerMessage.includes('currículum')) {
            return 'Para ayudarte con tu CV, lo mejor es que lo subas utilizando el botón de clip que ves a la izquierda del campo de texto. Así podré analizarlo y darte recomendaciones específicas.';
        }
        
        if (lowerMessage.includes('errores') || lowerMessage.includes('evitar')) {
            return 'Algunos errores comunes en los CV son: incluir información irrelevante, tener errores ortográficos, usar un formato inconsistente, no destacar logros medibles, y usar lenguaje genérico en lugar de específico.';
        }
        
        if (lowerMessage.includes('experiencia') || lowerMessage.includes('trabajo')) {
            return 'Si tienes poca experiencia laboral, enfócate en tus habilidades transferibles, proyectos académicos, voluntariados y prácticas. Describe detalladamente tus responsabilidades y logros en cada actividad.';
        }
        
        if (lowerMessage.includes('habilidades') || lowerMessage.includes('competencias')) {
            return 'Las habilidades blandas más valoradas incluyen: comunicación efectiva, trabajo en equipo, resolución de problemas, adaptabilidad, liderazgo, gestión del tiempo, y pensamiento crítico. Demuéstralas con ejemplos concretos.';
        }
        
        return 'Entiendo tu consulta. Para darte una respuesta más precisa, te sugiero subir tu CV usando el botón de clip o seleccionar una categoría específica de las opciones que te muestro. ¿En qué área específica necesitas ayuda?';
    }
}); 