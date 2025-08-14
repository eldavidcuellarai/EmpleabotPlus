document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - initializing chat...');
    feather.replace();

    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const fileInput = document.getElementById('pdfFile');
    const sendBtn = document.getElementById('sendBtn');
    const messageInputContainer = document.querySelector('.message-input-container');

    // Verificar que todos los elementos existen
    if (!messageInput || !chatForm) {
        console.error('Required elements not found:', {
            messageInput: !!messageInput,
            chatForm: !!chatForm
        });
        return;
    }

    console.log('All required elements found, setting up event listeners...');

    marked.setOptions({
        breaks: true,
        gfm: true
    });

    // Add event listeners to existing suggested question buttons
    function setupSuggestedQuestions() {
        const suggestedButtons = document.querySelectorAll('.suggested-question');
        console.log('Found suggested question buttons:', suggestedButtons.length);
        
        suggestedButtons.forEach((button, index) => {
            console.log(`Setting up button ${index}:`, button.textContent);
            
            // Remove any existing event listeners first
            button.replaceWith(button.cloneNode(true));
            const newButton = document.querySelectorAll('.suggested-question')[index];
            
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const questionText = this.textContent.trim();
                console.log('Suggested question clicked:', questionText);
                
                if (questionText && messageInput) {
                    messageInput.value = questionText;
                    messageInput.focus();
                    
                    // Optional: scroll to the chat input
                    messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Visual feedback
                    this.style.backgroundColor = 'var(--empleabot-green)';
                    this.style.color = 'white';
                    setTimeout(() => {
                        this.style.backgroundColor = '';
                        this.style.color = '';
                    }, 500);
                } else {
                    console.error('MessageInput not found or questionText is empty:', {
                        questionText,
                        messageInput: !!messageInput
                    });
                }
            });
        });
    }

    // Initialize suggested questions
    setupSuggestedQuestions();

    // Re-setup when accordion content is shown (in case buttons are in collapsed sections)
    document.addEventListener('shown.bs.collapse', function() {
        console.log('Accordion opened, re-setting up suggested questions...');
        setupSuggestedQuestions();
    });

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