document.addEventListener('DOMContentLoaded', function() {

    // 1. Header muda de cor ao rolar
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Scroll Suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Se for apenas um link # vazio, ignora
            if(this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Compensa a altura do header fixo
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Scroll Reveal Animation (Usando Intersection Observer - Leve e Moderno)
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealOptions = {
        threshold: 0.15, // Dispara quando 15% do elemento está visível
        rootMargin: "0px 0px -50px 0px" // Aciona um pouco antes de entrar totalmente na tela
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Adiciona a classe que faz a animação CSS acontecer
                entry.target.classList.add('revealed');
                
                // Se tiver delay (data-delay), aplica no CSS inline
                if(entry.target.dataset.delay) {
                   entry.target.style.transitionDelay = entry.target.dataset.delay + 'ms'; 
                }
                
                // Para de observar o elemento depois que ele apareceu
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Menu Mobile Funcional
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Opcional: Troca o ícone de 'lista' para 'fechar' (X)
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.replace('ph-list', 'ph-x');
    } else {
        icon.classList.replace('ph-x', 'ph-list');
    }
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').classList.replace('ph-x', 'ph-list');
    });
});
});