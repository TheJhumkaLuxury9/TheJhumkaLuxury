// Animations and visual effects
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeImageLoading();
    initializeScrollEffects();
});

function initializeAnimations() {
    // Add golden flowers animation
    const header = document.querySelector('.header');
    const flowerContainer = document.createElement('div');
    flowerContainer.className = 'golden-flowers';
    
    for (let i = 0; i < 10; i++) {
        const flower = document.createElement('div');
        flower.className = 'golden-flower';
        flower.style.left = `${Math.random() * 100}%`;
        flower.style.animationDelay = `${Math.random() * 8}s`;
        flower.style.opacity = 0.1 + Math.random() * 0.3;
        flowerContainer.appendChild(flower);
    }
    
    header.appendChild(flowerContainer);
}

function initializeImageLoading() {
    // Lazy loading with animation
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

function initializeScrollEffects() {
    // Add scroll animations to product cards
    const productCards = document.querySelectorAll('.product-card');
    const productObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        productObserver.observe(card);
    });
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});