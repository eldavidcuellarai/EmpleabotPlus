document.addEventListener('DOMContentLoaded', function() {

    // Inicializar Feather Icons
    feather.replace();
    
    // Add support for markdown rendering
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true
        });
    }
    
    // Connect search form to chatbot
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        // Handle search button click
        searchButton.addEventListener('click', function() {
            const question = searchInput.value.trim();
            if (question) {
                // Connect to chatbot
                const chatbotPanel = document.getElementById('chatbot-panel');
                const chatbotBubble = document.getElementById('chatbot-bubble');
                if (chatbotPanel && chatbotBubble) {
                    // Activate the chatbot if not already active
                    if (!chatbotPanel.classList.contains('active')) {
                        chatbotBubble.click();
                    }
                    
                    // Set the question in the input and send it
                    const userInput = document.getElementById('user-input');
                    const sendMessageBtn = document.getElementById('send-message');
                    if (userInput && sendMessageBtn) {
                        userInput.value = question;
                        // Trigger the send button click
                        sendMessageBtn.click();
                    }
                    
                    // Clear the search input
                    searchInput.value = '';
                }
            }
        });
        
        // Handle enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
    
    // ===== FAQ SLIDER FUNCTIONALITY =====
    const faqSlider = document.querySelector('.faq-slider');
    const prevBtn = document.getElementById('prev-faq');
    const nextBtn = document.getElementById('next-faq');
    const faqCards = document.querySelectorAll('.faq-card');
    
    if (faqSlider && prevBtn && nextBtn) {
        let currentPosition = 0;
        let cardWidth = 0;
        let visibleCards = 3; // Changed from 4 to 3
        
        // Update values on resize
        function updateSliderValues() {
            if (window.innerWidth <= 768) {
                visibleCards = 1;
            } else if (window.innerWidth <= 992) {
                visibleCards = 2;
            } else {
                visibleCards = 3; // Changed from 4 to 3 for desktop
            }
            
            cardWidth = faqSlider.offsetWidth / visibleCards;
            
            // Adjust current position if needed
            const maxPosition = faqCards.length - visibleCards;
            if (currentPosition > maxPosition) {
                currentPosition = maxPosition;
                updateSliderPosition();
            } else {
                updateNavigationButtons(); // Update button states when resizing
            }
        }
        
        // Function to update slider position
        function updateSliderPosition() {
            faqSlider.scrollLeft = currentPosition * cardWidth;
            updateNavigationButtons();
        }
        
        // Function to update navigation button states
        function updateNavigationButtons() {
            const maxPosition = faqCards.length - visibleCards;
            
            // Update previous button
            if (currentPosition <= 0) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
            
            // Update next button
            if (currentPosition >= maxPosition) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }
        
        // Initialize
        updateSliderValues();
        updateNavigationButtons(); // Initialize button states
        
        // Add click event listeners to navigation buttons
        prevBtn.addEventListener('click', () => {
            if (currentPosition > 0) {
                currentPosition--;
                updateSliderPosition();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentPosition < (faqCards.length - visibleCards)) {
                currentPosition++;
                updateSliderPosition();
            }
        });
        
        // Update values on window resize
        window.addEventListener('resize', updateSliderValues);
        
        // Make FAQ cards clickable to send questions to chat
        faqCards.forEach(card => {
            card.addEventListener('click', () => {
                const question = card.querySelector('h3').textContent;
                
                // If we have an empleabot chat widget
                const chatbotPanel = document.getElementById('chatbot-panel');
                const chatbotBubble = document.getElementById('chatbot-bubble');
                
                if (chatbotPanel && chatbotBubble) {
                    // Activate the chatbot if not already active
                    if (!chatbotPanel.classList.contains('active')) {
                        chatbotBubble.click();
                    }
                    
                    // Set the question in the input and send it
                    const userInput = document.getElementById('user-input');
                    const sendMessageBtn = document.getElementById('send-message');
                    
                    if (userInput && sendMessageBtn) {
                        userInput.value = question;
                        // Trigger the send button click
                        sendMessageBtn.click();
                    }
                }
            });
        });
    }
    
    // ===== CURSOS SLIDER FUNCTIONALITY =====
    const sliderUpdaters = {};
    const cursosTabContents = document.querySelectorAll('.tab-content');

    cursosTabContents.forEach(tab => {
        const cursosGrid = tab.querySelector('.cursos-grid');
        const prevBtnCursos = tab.querySelector('.cursos-prev');
        const nextBtnCursos = tab.querySelector('.cursos-next');
        const cursosCards = cursosGrid ? tab.querySelectorAll('.curso-card') : null;

        if (cursosGrid && prevBtnCursos && nextBtnCursos && cursosCards.length) {
            let cursosCurrentPos = 0;
            let visibleCards = 3; // Número de tarjetas visibles por defecto
            
            // Función para actualizar el número de tarjetas visibles según el ancho de la ventana
            function updateVisibleCards() {
                if (window.innerWidth <= 500) {
                    visibleCards = 1;
                } else if (window.innerWidth <= 768) {
                    visibleCards = 1; // Single card on mobile
                } else if (window.innerWidth <= 1200) {
                    visibleCards = 2; // Two cards on medium screens
                } else {
                    visibleCards = 3; // Always 3 cards on larger screens where container has fixed width
                }
                
                // Ensure at least 1 card is visible
                visibleCards = Math.max(1, visibleCards);
                updateNavButtons();
            }
            
            // Función para actualizar la visibilidad de los botones de navegación
            function updateNavButtons() {
                prevBtnCursos.classList.toggle('disabled', cursosCurrentPos === 0);
                nextBtnCursos.classList.toggle('disabled', cursosCurrentPos >= cursosCards.length - visibleCards);
                
                // Mejorar feedback visual y prevenir clicks en botones deshabilitados
                prevBtnCursos.style.opacity = cursosCurrentPos === 0 ? '0.5' : '1';
                prevBtnCursos.style.pointerEvents = cursosCurrentPos === 0 ? 'none' : 'auto';
                nextBtnCursos.style.opacity = cursosCurrentPos >= cursosCards.length - visibleCards ? '0.5' : '1';
                nextBtnCursos.style.pointerEvents = cursosCurrentPos >= cursosCards.length - visibleCards ? 'none' : 'auto';
            }

            // Función para deslizar a una tarjeta específica
            function slideToCard(index) {
                // Validación de límites para el índice
                if (index < 0) index = 0;
                if (index > cursosCards.length - visibleCards) index = cursosCards.length - visibleCards;
                
                cursosCurrentPos = index;
                
                // Calcular el ancho de la tarjeta y el espacio entre ellas
                const cardWidth = cursosCards[0].offsetWidth;
                const gap = 24; // El gap que definimos en CSS
                
                // Calculamos la posición exacta para el desplazamiento
                const scrollPosition = index * (cardWidth + gap);
                
                // Desplazar el contenedor padre (el viewport) al índice actual con animación suave
                tab.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
                
                updateNavButtons();
            }

            function recenterWithDelay() {
                if (tab.classList.contains('active')) {
                    updateVisibleCards();
                    setTimeout(() => slideToCard(cursosCurrentPos), 100);
                }
            }

            // Store the updater function
            sliderUpdaters[tab.id] = recenterWithDelay;

            // Recalculate on resize
            window.addEventListener('resize', recenterWithDelay);

            prevBtnCursos.addEventListener('click', () => {
                // Desplazamiento de un grupo de tarjetas hacia atrás
                slideToCard(cursosCurrentPos - visibleCards);
            });

            nextBtnCursos.addEventListener('click', () => {
                // Desplazamiento de un grupo de tarjetas hacia adelante
                slideToCard(cursosCurrentPos + visibleCards);
            });
            
            // Inicializar
            updateVisibleCards();
        }
    });

    // ===== FEATURES SECTION FUNCTIONALITY =====
    const featureButtons = document.querySelectorAll('.feature-button');
    const featureContents = document.querySelectorAll('.feature-content');
    const featureContentContainer = document.querySelector('.feature-content-container');
    
    if (featureButtons.length > 0 && featureContents.length > 0 && featureContentContainer) {
        featureButtons[0].classList.add('active');
        featureContents.forEach(content => {
            content.style.display = 'none';
        });
        featureButtons.forEach(button => {
            button.addEventListener('click', () => {
                featureButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                featureContentContainer.classList.add('active');
                featureContents.forEach(content => {
                    content.style.display = 'none';
                });
                const targetId = button.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
    }
    
    // ===== CAPACITACIÓN TABS FUNCTIONALITY =====
    const tabButtons = document.querySelectorAll('.tab-button');
    // tabContents is already defined in CURSOS SLIDER section
    const sectionDescriptions = document.querySelectorAll('#section-description-container p');
    
    // Set IA tab as active by default
    const initialTabContent = document.getElementById('ia-content');
    document.querySelector('[data-target="ia"]').classList.add('active');
    if (initialTabContent) {
        initialTabContent.classList.add('active');
    }

    // Initial centering for the first active tab's slider
    if (initialTabContent && sliderUpdaters[initialTabContent.id]) {
        sliderUpdaters[initialTabContent.id]();
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) return;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            cursosTabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const targetId = button.getAttribute('data-target');
            const contentId = `${targetId}-content`;
            const contentElement = document.getElementById(contentId);
            if (contentElement) {
                contentElement.classList.add('active');
            }
            
            if (sliderUpdaters[contentId]) {
                sliderUpdaters[contentId]();
            }
        });
    });
    
    // ===== ANIMATIONS ON SCROLL =====
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('appear');
            }
        });
    };
    
    // Run on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Scroll suave a la sección de Capacitación con IA
    const btnAprender = document.getElementById('btn-aprender');
    if (btnAprender) {
        btnAprender.addEventListener('click', function() {
            const seccion = document.getElementById('capacitacion');
            if (seccion) {
                seccion.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Abrir la burbuja de chat al hacer click en 'Mejora tu CV con IA'
    const btnMejoraCV = document.getElementById('btn-mejora-cv');
    if (btnMejoraCV) {
        btnMejoraCV.addEventListener('click', function() {
            const chatbotBubble = document.getElementById('chatbot-bubble');
            if (chatbotBubble) {
                chatbotBubble.click();
            }
        });
    }
});