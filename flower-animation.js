// Generate and animate golden flowers
document.addEventListener('DOMContentLoaded', () => {
    const flowers = document.querySelector('.golden-flowers');
    const flowerCount = 12; // Number of flowers to create
    
    // Create and position flowers
    for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('div');
        flower.className = 'golden-flower';
        
        // Random position
        flower.style.left = `${Math.random() * 100}%`;
        flower.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        flower.style.animationDelay = `${Math.random() * 8}s`;
        
        // Random size variation
        const size = 70 + Math.random() * 60;
        flower.style.width = `${size}px`;
        flower.style.height = `${size}px`;
        
        // Random rotation
        flower.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        flowers.appendChild(flower);
    }
});