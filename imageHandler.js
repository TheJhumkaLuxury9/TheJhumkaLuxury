// Image loading and optimization handler
document.addEventListener('DOMContentLoaded', () => {
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        // Add loading animation
        img.parentElement.classList.add('loading');
        
        img.onload = function() {
            // Remove loading animation when image is loaded
            img.parentElement.classList.remove('loading');
        };
        
        img.onerror = function() {
            // Show fallback image if loading fails
            img.src = 'images/placeholder.jpg';
            img.parentElement.classList.remove('loading');
        };
    });
});

// Lazy loading for images
const lazyLoad = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        if (img.getBoundingClientRect().top < window.innerHeight + 100) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    });
};

// Listen for scroll to lazy load images
window.addEventListener('scroll', lazyLoad);
window.addEventListener('load', lazyLoad);