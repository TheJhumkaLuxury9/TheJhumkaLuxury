// Image optimization and loading handler
const imageOptimizer = {
    // Predefined image sizes for responsive loading
    sizes: {
        thumbnail: 400,
        medium: 800,
        large: 1200
    },

    // Generate srcset for responsive images
    generateSrcset(basePath, filename) {
        return `
            ${basePath}/thumbnails/${filename} 400w,
            ${basePath}/${filename} 800w,
            ${basePath}/large/${filename} 1200w
        `;
    },

    // Load image with fade-in effect
    loadWithEffect(img) {
        img.style.opacity = '0';
        img.onload = () => {
            img.style.transition = 'opacity 0.5s ease-in';
            img.style.opacity = '1';
            img.parentElement.classList.remove('loading');
        };
    },

    // Initialize all product images
    init() {
        const productImages = document.querySelectorAll('.product-image img');
        productImages.forEach(img => {
            // Add loading state
            img.parentElement.classList.add('loading');
            
            // Set up responsive images
            if (img.dataset.src) {
                const srcset = this.generateSrcset('images', img.dataset.src.split('/').pop());
                img.srcset = srcset;
                img.sizes = "(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px";
            }

            // Add loading effect
            this.loadWithEffect(img);
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    imageOptimizer.init();
});