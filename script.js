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