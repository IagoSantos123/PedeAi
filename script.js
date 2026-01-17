document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MENU MOBILE =====
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    function toggleMenu() {
        const isActive = menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        navMenu.setAttribute('aria-hidden', !isActive);
        
        // Previne scroll do body quando menu está aberto
        document.body.style.overflow = isActive ? 'hidden' : '';
    }
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', toggleMenu);
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
        
        // Fechar menu ao clicar fora ou na tecla ESC
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                toggleMenu();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.classList.contains('active')) {
                toggleMenu();
            }
        });
    }
    
    // ===== BOTÕES CTA =====
    document.querySelectorAll('#header-cta, #hero-cta').forEach(button => {
        button.addEventListener('click', () => {
            const contactSection = document.getElementById('contato');
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Fecha menu mobile se estiver aberto
            if (menuToggle.classList.contains('active')) {
                toggleMenu();
            }
            
            // Efeito de clique
            button.style.transform = 'scale(0.95)';
            setTimeout(() => button.style.transform = '', 200);
        });
    });
    
    // ===== FORMULÁRIOS =====
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // Formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            let isValid = true;
            
            // Validação
            this.querySelectorAll('input[required], select[required]').forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
            });
            
            if (!isValid) {
                showNotification('Preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Simulação de envio
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simula delay de rede
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showNotification('Solicitação enviada! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
    
    // Newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]');
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                email.style.borderColor = '#e74c3c';
                showNotification('Digite um e-mail válido.', 'error');
                return;
            }
            
            email.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            showNotification('Inscrição realizada com sucesso!', 'success');
            email.value = '';
        });
    }
    
    // ===== NOTIFICAÇÕES =====
    function showNotification(message, type = 'success') {
        // Remove notificação anterior
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Botão de fechar
        notification.querySelector('.notification-close').onclick = () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        };
        
        // Remove automático após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // ===== FUNÇÕES AUXILIARES =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // ===== ANIMAÇÃO AO SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    document.querySelectorAll('.solution-card, .advantage-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // ===== SCROLL SUAVE PARA ÂNCORAS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===== BOTÕES DE SOLUÇÃO =====
    document.querySelectorAll('.solution-button').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.solution-card');
            const title = card.querySelector('h3').textContent;
            showNotification(`Redirecionando para mais informações sobre ${title}`, 'success');
            
            // Simula redirecionamento
            setTimeout(() => {
                document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        });
    });
    
    // ===== SISTEMA DE DEMONSTRAÇÃO =====
    // Inicializa o sistema de troca de telas
    function initDemoSystem() {
        console.log('🚀 Inicializando sistema de demonstração...');
        
        const demoButtons = document.querySelectorAll('.demo-tab');
        const demoScreens = document.querySelectorAll('.demo-screen');
        
        if (demoButtons.length === 0 || demoScreens.length === 0) {
            console.log('⚠️ Sistema de demonstração não encontrado na página');
            return;
        }
        
        console.log(`✅ ${demoButtons.length} botões e ${demoScreens.length} telas encontradas`);
        
        // Função para trocar de tela
        function switchScreen(screenId) {
            // Esconde todas as telas
            demoScreens.forEach(screen => {
                screen.style.display = 'none';
                screen.classList.remove('active');
            });
            
            // Mostra a tela selecionada
            const activeScreen = document.getElementById(screenId);
            if (activeScreen) {
                activeScreen.style.display = 'block';
                activeScreen.classList.add('active');
                
                // Anima a entrada
                animateScreenEntry(activeScreen);
            }
        }
        
        // Adiciona eventos aos botões
        demoButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Previne propagação
                
                const screenId = this.getAttribute('data-tab') + '-screen';
                console.log(`📱 Trocar para tela: ${screenId}`);
                
                // Remove active de todos os botões
                demoButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adiciona active ao botão clicado
                this.classList.add('active');
                
                // Troca a tela
                switchScreen(screenId);
            });
        });
        
        // Função para animar entrada da tela
        function animateScreenEntry(screen) {
            const elements = screen.querySelectorAll('.status-card, .order-card, .kitchen-order, .campaign-item, .recommendation-item');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
        
        // Simulação de dados do dashboard
        function simulateDashboardUpdates() {
            const tables = document.querySelectorAll('.table');
            tables.forEach(table => {
                if (table.classList.contains('occupied')) {
                    const timeSpan = table.querySelector('.table-status');
                    if (timeSpan && timeSpan.textContent !== 'Livre') {
                        const currentTime = parseInt(timeSpan.textContent.replace('min', '')) || 10;
                        const newTime = currentTime + Math.floor(Math.random() * 3);
                        timeSpan.textContent = `${newTime}min`;
                    }
                }
            });
        }
        
        // Interatividade do pedido
        function initOrderSimulation() {
            const nextStepBtn = document.querySelector('.next-step');
            const stepBackBtn = document.querySelector('.step-back');
            const stepCompleteBtn = document.querySelector('.step-complete');
            
            if (nextStepBtn) {
                nextStepBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showStep('register');
                });
            }
            
            if (stepBackBtn) {
                stepBackBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showStep('menu');
                });
            }
            
            if (stepCompleteBtn) {
                stepCompleteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showStep('confirmation');
                });
            }
            
            function showStep(step) {
                const orderSteps = document.querySelectorAll('[data-step]');
                orderSteps.forEach(stepEl => {
                    stepEl.style.display = 'none';
                });
                
                const targetStep = document.querySelector(`[data-step="${step}"]`);
                if (targetStep) {
                    targetStep.style.display = 'block';
                }
            }
        }
        
        // Interatividade das mesas
        function initTablesInteraction() {
            const tables = document.querySelectorAll('.table');
            tables.forEach(table => {
                table.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                });
            });
        }
        
        // Botões da cozinha
        function initKitchenButtons() {
            const buttons = document.querySelectorAll('.action-btn');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    if (this.classList.contains('finish')) {
                        const items = this.closest('.kitchen-order').querySelectorAll('.item-status');
                        items.forEach(item => {
                            item.textContent = 'Pronto';
                            item.className = 'item-status ready';
                        });
                        
                        this.innerHTML = '<i class="fas fa-check-double"></i> Entregue';
                        this.classList.remove('finish');
                        this.classList.add('notify');
                        
                    } else if (this.classList.contains('notify')) {
                        const orderId = this.closest('.kitchen-order').querySelector('.order-id').textContent;
                        showNotification(`Cliente ${orderId} notificado!`, 'success');
                        this.innerHTML = '<i class="fas fa-bell"></i> Notificado';
                        this.disabled = true;
                    }
                });
            });
        }
        
        // Inicializa todas as funcionalidades interativas
        initOrderSimulation();
        initTablesInteraction();
        initKitchenButtons();
        
        // Inicia atualizações automáticas
        setInterval(simulateDashboardUpdates, 10000);
        
        // Garante que a primeira tela está ativa
        const firstButton = document.querySelector('.demo-tab.active');
        if (firstButton) {
            const firstScreenId = firstButton.getAttribute('data-tab') + '-screen';
            switchScreen(firstScreenId);
        } else if (demoButtons.length > 0) {
            // Se nenhum botão estiver ativo, ativa o primeiro
            demoButtons[0].classList.add('active');
            const firstScreenId = demoButtons[0].getAttribute('data-tab') + '-screen';
            switchScreen(firstScreenId);
        }
        
        console.log('✅ Sistema de demonstração inicializado com sucesso!');
    }
    
    // ===== INICIALIZAÇÃO DO SISTEMA DE DEMONSTRAÇÃO =====
    // Aguarda um pouco para garantir que tudo carregou
    setTimeout(() => {
        initDemoSystem();
        
        // Anima os cards das funcionalidades
        const featureCards = document.querySelectorAll('.feature-card');
        const flowSteps = document.querySelectorAll('.flow-step');
        
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.2
        });
        
        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            featureObserver.observe(card);
        });
        
        flowSteps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-20px)';
            step.style.transition = 'all 0.6s ease';
            featureObserver.observe(step);
        });
    }, 500);
    
    // ===== PREVENÇÃO DE ZOOM NO IOS =====
    document.addEventListener('touchstart', () => {}, {passive: true});
    
    console.log('✅ Cardápio Digital - Site carregado com sucesso!');
});

// ===== FUNÇÕES GLOBAIS AUXILIARES =====
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = `Clique para saber mais sobre ${text}`;
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'var(--primary-color)';
    tooltip.style.color = 'var(--text-color)';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '0.85rem';
    tooltip.style.zIndex = '1000';
    tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    tooltip.style.border = '1px solid var(--card-border)';
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.left = `${rect.left + rect.width / 2 - 100}px`;
    tooltip.style.width = '200px';
    tooltip.style.textAlign = 'center';
    
    tooltip.id = 'feature-tooltip';
    document.body.appendChild(tooltip);
}

function hideTooltip() {
    const tooltip = document.getElementById('feature-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}