// Cart and Vipps payment handling
const cart = {
    items: [],
    
    init() {
        this.loadCart();
        this.updateCartDisplay();
        this.setupEventListeners();
    },
    
    loadCart() {
        const savedCart = localStorage.getItem('jhumkaCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    },
    
    saveCart() {
        localStorage.setItem('jhumkaCart', JSON.stringify(this.items));
    },
    
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({...product, quantity: 1});
        }
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`Added ${product.name} to cart`);
    },
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    },
    
    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartItems = document.getElementById('cart-items');
        
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (cartCount) cartCount.textContent = totalItems;
        if (cartTotal) cartTotal.textContent = `${totalPrice} NOK`;
        
        if (cartItems) {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" width="50">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price} NOK × ${item.quantity}</p>
                    </div>
                    <button onclick="cart.removeItem('${item.id}')" class="remove-item">×</button>
                </div>
            `).join('');
        }
    },
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <div class="notification-progress"></div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    },
    
    proceedToVipps() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderDetails = {
            items: this.items,
            total: total,
            vippsNumber: '45898908'
        };
        
        // Show Vipps payment modal
        this.showVippsModal(orderDetails);
    },
    
    showVippsModal(orderDetails) {
        const modal = document.createElement('div');
        modal.className = 'vipps-modal';
        modal.innerHTML = `
            <div class="vipps-modal-content">
                <h3>Complete Your Purchase</h3>
                <p>Total Amount: ${orderDetails.total} NOK</p>
                <div class="vipps-instructions">
                    <p>To complete your purchase:</p>
                    <ol>
                        <li>Open Vipps app on your phone</li>
                        <li>Send payment to: ${orderDetails.vippsNumber}</li>
                        <li>Include your order number in the message</li>
                    </ol>
                    <div class="vipps-number">
                        <span>Vipps Number:</span>
                        <strong>${orderDetails.vippsNumber}</strong>
                    </div>
                </div>
                <button onclick="cart.confirmOrder()" class="confirm-button">I've Sent the Payment</button>
                <button onclick="this.parentElement.parentElement.remove()" class="cancel-button">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    confirmOrder() {
        // Clear cart and show confirmation
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        
        // Remove modal and show success message
        document.querySelector('.vipps-modal').remove();
        this.showNotification('Thank you for your order! You will receive confirmation shortly.');
    },
    
    setupEventListeners() {
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const product = {
                    id: card.dataset.id,
                    name: card.querySelector('.product-title').textContent,
                    price: parseInt(card.querySelector('.price-tag').textContent),
                    image: card.querySelector('img').src
                };
                this.addItem(product);
            });
        });
    }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => cart.init());