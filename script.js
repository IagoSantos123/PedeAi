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
    
    // Newsletter
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
    
    // ===== INICIALIZAÇÃO =====
    console.log('Cardápio Digital - Site carregado com sucesso!');
    
    // Previne zoom em inputs no iOS
    document.addEventListener('touchstart', () => {}, {passive: true});
});

// ===== INTERATIVIDADE DAS FUNCIONALIDADES =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Simulação de dados em tempo real no dashboard
    function updateDashboard() {
        const occupiedTables = document.querySelector('.dashboard-value');
        const averageTime = document.querySelectorAll('.dashboard-value')[1];
        const orderTimes = document.querySelectorAll('.order-time');
        
        if (occupiedTables) {
            // Simula variação nas mesas ocupadas
            const currentTables = parseInt(occupiedTables.textContent.split('/')[0]);
            const maxTables = 25;
            const newTables = Math.min(maxTables, Math.max(5, currentTables + Math.floor(Math.random() * 3) - 1));
            occupiedTables.textContent = `${newTables}/${maxTables}`;
            
            // Atualiza barra de progresso
            const progress = document.querySelector('.progress-bar');
            if (progress) {
                progress.style.width = `${(newTables / maxTables) * 100}%`;
            }
        }
        
        if (averageTime) {
            // Simula variação no tempo médio
            const currentTime = parseInt(averageTime.textContent.replace('min', ''));
            const newTime = Math.max(5, Math.min(30, currentTime + Math.floor(Math.random() * 2) - 1));
            averageTime.textContent = `${newTime}min`;
        }
        
        if (orderTimes.length > 0) {
            // Atualiza tempos dos pedidos
            orderTimes.forEach((timeEl, index) => {
                const baseTime = [12, 8, 5];
                const newTime = Math.max(1, baseTime[index] + Math.floor(Math.random() * 2));
                timeEl.textContent = `Há ${newTime} min`;
            });
        }
    }
    
    // Anima os cards de funcionalidade ao scroll
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
    
    // Tooltips para funcionalidades
    featureCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        card.addEventListener('mouseenter', () => {
            showTooltip(card, title);
        });
        
        card.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
    
    // Inicia atualização do dashboard
    setInterval(updateDashboard, 5000);
});

// Funções auxiliares
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

// ===== SISTEMA DE DEMONSTRAÇÃO CORRIGIDO =====

// Função principal para inicializar o sistema de demonstração
function initDemoSystem() {
    console.log('Inicializando sistema de demonstração...');
    
    // Navegação entre telas - versão corrigida
    const demoButtons = document.querySelectorAll('.demo-tab');
    const demoScreens = document.querySelectorAll('.demo-screen');
    
    if (demoButtons.length && demoScreens.length) {
        console.log(`${demoButtons.length} botões e ${demoScreens.length} telas encontrados`);
        
        demoButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                console.log('Botão clicado:', this.getAttribute('data-tab'));
                
                // Remove classe active de todos os botões
                demoButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.pointerEvents = 'auto'; // Garante que todos estão clicáveis
                });
                
                // Adiciona classe active ao botão clicado
                this.classList.add('active');
                
                // Obtém o ID da tela
                const screenId = this.getAttribute('data-tab') + '-screen';
                console.log('Mostrando tela:', screenId);
                
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
                    
                    // Anima a entrada da nova tela
                    setTimeout(() => {
                        animateScreenEntry(activeScreen);
                    }, 50);
                }
            });
        });
        
        // Garante que a primeira tela está visível
        const firstScreen = document.getElementById('dashboard-screen');
        if (firstScreen) {
            firstScreen.style.display = 'block';
            firstScreen.classList.add('active');
        }
    } else {
        console.error('Elementos não encontrados. Verifique os seletores.');
        console.log('Botões:', demoButtons);
        console.log('Telas:', demoScreens);
    }
    
    // Simulação de dados em tempo real para o dashboard
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
    
    // Função para animar entrada da tela
    function animateScreenEntry(screen) {
        const elements = screen.querySelectorAll('.status-card, .order-card, .kitchen-order, .campaign-item, .recommendation-item, .feature-card');
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
    
    // Simulação de pedido na mesa
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
        
        // Botões de adicionar item
        const addButtons = document.querySelectorAll('.add-item');
        addButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                this.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                const itemCount = document.querySelector('.item-count');
                if (itemCount) {
                    const current = parseInt(itemCount.textContent) || 0;
                    itemCount.textContent = `${current + 1} itens`;
                }
            });
        });
        
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
    
    // Interatividade nas mesas
    function initTablesInteraction() {
        const tableElements = document.querySelectorAll('.table');
        tableElements.forEach(table => {
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
        const kitchenButtons = document.querySelectorAll('.action-btn');
        kitchenButtons.forEach(button => {
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
                    const orderCard = this.closest('.kitchen-order');
                    const orderId = orderCard.querySelector('.order-id').textContent;
                    
                    // Cria notificação
                    const notification = document.createElement('div');
                    notification.className = 'notification notification-success';
                    notification.innerHTML = `
                        <p>Cliente ${orderId} notificado!</p>
                        <button class="notification-close">&times;</button>
                    `;
                    document.body.appendChild(notification);
                    
                    // Remove após 3 segundos
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 3000);
                    
                    this.innerHTML = '<i class="fas fa-bell"></i> Notificado';
                    this.disabled = true;
                }
            });
        });
    }
    
    // Inicializa todas as funcionalidades
    initOrderSimulation();
    initTablesInteraction();
    initKitchenButtons();
    
    // Inicia atualizações automáticas
    setInterval(simulateDashboardUpdates, 10000);
    
    // Anima a primeira tela
    setTimeout(() => {
        const firstScreen = document.querySelector('.demo-screen.active');
        if (firstScreen) {
            animateScreenEntry(firstScreen);
        }
    }, 500);
}

// ===== INICIALIZAÇÃO GERAL CORRIGIDA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente carregado');
    
    // Chama a função principal
    initDemoSystem();
    
    // ===== MENU MOBILE (mantenha seu código existente) =====
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    function toggleMenu() {
        const isActive = menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        navMenu.setAttribute('aria-hidden', !isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', toggleMenu);
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }
    
    // ===== FORMULÁRIOS (mantenha seu código existente) =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // Seu código de validação aqui...
        });
    }
    
    // ===== NOTIFICAÇÕES (função auxiliar) =====
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    };
    
    console.log('Script inicializado com sucesso!');
});

// Fallback: Se o DOMContentLoaded já passou, executa diretamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoSystem);
} else {
    initDemoSystem();
}