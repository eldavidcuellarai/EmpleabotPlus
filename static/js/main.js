
// Function to open chat bubble and focus on chat
function openChatBubble() {
    const chatWidget = document.getElementById('chatWidget');
    const floatingBtn = document.getElementById('floatingChatBtn');
    
    if (chatWidget && chatWidget.style.display === 'none') {
        // Show the floating chat widget
        chatWidget.style.display = 'flex';
        chatWidget.classList.remove('minimized');
        chatWidget.classList.add('minimized');
        
        // Hide the floating button
        floatingBtn.style.display = 'none';
        
        // Focus on widget input after animation
        setTimeout(() => {
            const widgetInput = document.getElementById('messageInputWidget');
            if (widgetInput) {
                widgetInput.focus();
            }
        }, 300);
    } else {
        // Fallback to main chat container
        const chatContainer = document.querySelector('.chat-container');
        const messageInput = document.getElementById('messageInput');
        
        if (chatContainer) {
            chatContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            chatContainer.style.transform = 'scale(1.02)';
            chatContainer.style.boxShadow = '0 12px 48px rgba(33, 130, 92, 0.15)';
            
            setTimeout(() => {
                chatContainer.style.transform = 'scale(1)';
                chatContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
            }, 300);
            
            if (messageInput) {
                setTimeout(() => {
                    messageInput.focus();
                    messageInput.placeholder = "¡Perfecto! Ahora cuéntame sobre tu CV...";
                }, 500);
            }
        }
    }
}

// Function to handle suggested questions
function selectSuggestion(button) {
    const question = button.textContent;
    const widgetInput = document.getElementById('messageInputWidget');
    if (widgetInput) {
        widgetInput.value = question;
        // Simulate sending the message
        setTimeout(() => {
            addMessageToWidget(question, 'user-message');
            // Add bot response
            setTimeout(() => {
                let response = 'Perfecto, te ayudo con eso. ¿Podrías compartir más detalles?';
                if (question.includes('CV')) {
                    response = 'Excelente pregunta. Para mejorar tu CV, necesito conocer tu experiencia actual. ¿Podrías subir tu CV o contarme sobre tu perfil profesional?';
                } else if (question.includes('entrevista')) {
                    response = 'Las entrevistas pueden ser desafiantes, pero con preparación todo mejora. ¿Para qué tipo de posición te estás preparando?';
                } else if (question.includes('curso')) {
                    response = 'Los cursos son una excelente forma de crecer profesionalmente. ¿En qué área específica te gustaría especializarte?';
                }
                addMessageToWidget(response, 'bot-message');
            }, 1000);
        }, 100);
        widgetInput.value = '';
    }
}

// Function to add messages to widget
function addMessageToWidget(text, className) {
    const messagesContainer = document.getElementById('chatMessagesWidget');
    if (messagesContainer) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    
    // Chat widget controls
    const chatWidget = document.getElementById('chatWidget');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const maximizeBtn = document.getElementById('maximizeBtn');
    const closeBtn = document.getElementById('closeBtn');
    const floatingBtn = document.getElementById('floatingChatBtn');

    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            chatWidget.classList.add('minimized');
            chatWidget.classList.remove('maximized');
        });
    }

    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            chatWidget.classList.remove('minimized');
            chatWidget.classList.add('maximized');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatWidget.style.display = 'none';
            floatingBtn.style.display = 'flex';
        });
    }

    // File upload for widget
    const fileUploadBtn = document.getElementById('fileUploadBtn');
    const fileInputWidget = document.getElementById('fileInputWidget');
    
    if (fileUploadBtn && fileInputWidget) {
        fileUploadBtn.addEventListener('click', () => {
            fileInputWidget.click();
        });

        fileInputWidget.addEventListener('change', () => {
            if (fileInputWidget.files.length > 0) {
                const fileName = fileInputWidget.files[0].name;
                addMessageToWidget(`Archivo adjuntado: ${fileName}`, 'user-message');
                setTimeout(() => {
                    addMessageToWidget('He recibido tu archivo. ¿En qué área específica te gustaría que me enfoque para ayudarte?', 'bot-message');
                }, 500);
            }
        });
    }

    // Widget form submission
    const chatFormWidget = document.getElementById('chatFormWidget');
    if (chatFormWidget) {
        chatFormWidget.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('messageInputWidget');
            const message = input.value.trim();
            if (message) {
                addMessageToWidget(message, 'user-message');
                input.value = '';
                
                // Simulate bot response
                setTimeout(() => {
                    let botResponse = 'Entiendo. ¿Podrías proporcionarme más detalles sobre tu solicitud?';
                    
                    if (message.toLowerCase().includes('cv')) {
                        botResponse = 'Para ayudarte con tu CV, ¿podrías adjuntar tu CV actual o decirme específicamente qué aspecto te gustaría mejorar?';
                    } else if (message.toLowerCase().includes('entrevista')) {
                        botResponse = 'Te puedo ayudar con consejos para entrevistas. ¿Es para algún sector específico o tipo de posición en particular?';
                    } else if (message.toLowerCase().includes('curso')) {
                        botResponse = '¿En qué área te gustaría desarrollarte? Esto me ayudará a recomendarte los cursos más relevantes.';
                    }
                    
                    addMessageToWidget(botResponse, 'bot-message');
                }, 1000);
            }
        });
    }
    
    // Add click handlers to action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.querySelector('h3').textContent;
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.value = `Ayúdame con: ${title}`;
                openChatBubble();
            }
        });
    });
});
