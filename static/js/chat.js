document.addEventListener('DOMContentLoaded', function() {
    feather.replace();

    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const fileInput = document.getElementById('pdfFile');
    const sendBtn = document.getElementById('sendBtn');
    const buttonGrid = document.getElementById('buttonGrid');
    const categoryTitle = document.getElementById('categoryTitle');
    const messageInputContainer = document.querySelector('.message-input-container');

    marked.setOptions({
        breaks: true,
        gfm: true
    });

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

    function showCategoryQuestions(category) {
        // Update category title
        categoryTitle.querySelector('.section-title').textContent = category;

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
                messageInput.value = question.text;
                messageInput.focus();
                showMainCategories();
            });
            buttonGrid.appendChild(questionButton);
        });

        // Initialize Feather icons for the new buttons
        feather.replace();
    }

    function showMainCategories() {
        // Update title to default
        categoryTitle.querySelector('.section-title').textContent = 'Comparte tu CV y selecciona el área que quieres mejorar';

        // Remove questions grid class
        buttonGrid.classList.remove('questions-grid');

        // Clear and restore main category buttons
        buttonGrid.innerHTML = Object.entries(categoryQuestions).map(([category, _]) => `
            <div class="action-button">
                <i data-feather="${categoryIcons[category]}" class="category-icon"></i>
                <h3>${category}</h3>
                <p>${getCategoryDescription(category)}</p>
            </div>
        `).join('');

        // Initialize icons
        feather.replace();

        // Attach category click handlers
        document.querySelectorAll('.action-button').forEach(button => {
            if (!button.classList.contains('back-button') && !button.classList.contains('question-button')) {
                button.addEventListener('click', function() {
                    const category = this.querySelector('h3').textContent;
                    showCategoryQuestions(category);
                });
            }
        });
    }

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

    // Initialize the main categories view
    showMainCategories();

    // Handle file input change
    fileInput.addEventListener('change', function() {
        const fileName = this.files[0]?.name;
        if (fileName) {
            const fileDisplay = document.createElement('div');
            fileDisplay.className = 'selected-file';
            fileDisplay.innerHTML = `<i data-feather="file-text"></i>${fileName}`;

            const existingFileDisplay = messageInputContainer.querySelector('.selected-file');
            if (existingFileDisplay) {
                existingFileDisplay.remove();
            }

            messageInputContainer.insertBefore(fileDisplay, messageInput);
            feather.replace();
        }
    });

    // Handle chat submission
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (!message && !fileInput.files[0]) return;

        try {
            const formData = new FormData();
            formData.append('message', message);

            const file = fileInput.files[0];
            if (file) {
                formData.append('file', file);
                fileInput.value = '';
                const fileDisplay = messageInputContainer.querySelector('.selected-file');
                if (fileDisplay) {
                    fileDisplay.remove();
                }
            }

            if (message) {
                addMessage(message, 'user');
                scrollToBottom();
            }

            if (buttonGrid && !buttonGrid.classList.contains('hidden')) {
                buttonGrid.classList.add('hidden');
            }

            sendBtn.disabled = true;
            sendBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

            const response = await fetch('/chat', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la respuesta del servidor');
            }

            messageInput.value = '';

            if (data && data.response) {
                addMessage(data.response, 'bot');
                scrollToBottom();
            } else {
                throw new Error('Respuesta vacía del servidor');
            }

        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'Error al procesar la solicitud');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i data-feather="send"></i>';
            feather.replace();
        }
    });

    // Helper function to add messages to the chat
    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        try {
            // Create content container
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';

            if (type === 'bot') {
                // Check if content contains a proper suggestions section
                // A proper suggestions section has a line with exactly "---" (and nothing else) 
                // followed by "**Sugerencias:**" within a reasonable distance
                const suggestionsPattern = /\n---\n(?:[\s\S]{0,150}?)\*\*Sugerencias:\*\*/;
                
                // Only consider it a suggestions section if:
                // 1. It matches the pattern above
                // 2. The "---" is not part of a longer line with other characters
                const lines = content.split('\n');
                let hasSuggestionsSection = false;
                let separatorIndex = -1;
                
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] === '---') {
                        // Check if this is followed by "**Sugerencias:**" within a reasonable distance
                        const remainingContent = lines.slice(i).join('\n');
                        if (remainingContent.includes('**Sugerencias:**') && 
                            remainingContent.indexOf('**Sugerencias:**') < 150) {
                            hasSuggestionsSection = true;
                            separatorIndex = i;
                            break;
                        }
                    }
                }
                
                if (hasSuggestionsSection && separatorIndex >= 0) {
                    // Split content at the separator
                    const mainContent = lines.slice(0, separatorIndex).join('\n');
                    const suggestionsContent = lines.slice(separatorIndex).join('\n');
                    
                    // Process main content
                    contentDiv.innerHTML = marked.parse(mainContent);
                    messageDiv.appendChild(contentDiv);
                    
                    // Process suggestions
                    const suggestionsDiv = document.createElement('div');
                    suggestionsDiv.className = 'suggestions-container';

                    // Extract suggestions using regex
                    const suggestionRegex = /\[(.*?)\]\((acción:.*?)\)/g;
                    let match;

                    while ((match = suggestionRegex.exec(suggestionsContent)) !== null) {
                        const [_, questionText] = match;
                        const button = document.createElement('button');
                        button.className = 'suggestion-button';
                        button.textContent = questionText;
                        button.addEventListener('click', () => {
                            messageInput.value = questionText;
                            messageInput.focus();
                        });
                        suggestionsDiv.appendChild(button);
                    }

                    if (suggestionsDiv.children.length > 0) {
                        messageDiv.appendChild(suggestionsDiv);
                    }
                } else {
                    // If no proper suggestions section, render the entire content
                    contentDiv.innerHTML = marked.parse(content);
                    messageDiv.appendChild(contentDiv);
                }

                // Add copy button
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-button';
                copyButton.innerHTML = '<i data-feather="copy"></i>';
                copyButton.title = 'Copiar mensaje';

                copyButton.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(contentDiv.textContent);
                        copyButton.innerHTML = '<i data-feather="check"></i>';
                        feather.replace();
                        setTimeout(() => {
                            copyButton.innerHTML = '<i data-feather="copy"></i>';
                            feather.replace();
                        }, 2000);
                    } catch (err) {
                        console.error('Error al copiar:', err);
                        copyButton.innerHTML = '<i data-feather="x"></i>';
                        feather.replace();
                        setTimeout(() => {
                            copyButton.innerHTML = '<i data-feather="copy"></i>';
                            feather.replace();
                        }, 2000);
                    }
                });

                messageDiv.appendChild(copyButton);
            } else {
                contentDiv.textContent = content;
                messageDiv.appendChild(contentDiv);
            }

            chatMessages.appendChild(messageDiv);
            feather.replace();
        } catch (error) {
            console.error('Error al procesar el mensaje:', error);
            // Fallback to simple text display if parsing fails
            messageDiv.textContent = content;
            chatMessages.appendChild(messageDiv);
        }
    }

    // Helper function to scroll to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Helper function to show errors
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        chatMessages.appendChild(errorDiv);
    }

    // Function to open chat bubble (will be implemented when chat widget is integrated)
    function openChatBubble() {
        // For now, scroll to chat container or show a modal
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.scrollIntoView({ behavior: 'smooth' });
            chatContainer.style.transform = 'scale(1.02)';
            setTimeout(() => {
                chatContainer.style.transform = 'scale(1)';
            }, 200);
            
            // Focus on the message input
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                setTimeout(() => {
                    messageInput.focus();
                }, 500);
            }
        }
    }

    // Add click handlers for floating chat button
    document.addEventListener('DOMContentLoaded', function() {
        const floatingBtn = document.getElementById('floatingChatBtn');
        if (floatingBtn) {
            floatingBtn.addEventListener('click', openChatBubble);
        }
    });
});