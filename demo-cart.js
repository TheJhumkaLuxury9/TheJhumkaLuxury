// Simple client-side cart (demo) using data-* attributes and localStorage
// Adds items to cart, shows a small sidebar, and handles a demo checkout that stores orders in localStorage

(function(){
    const CART_KEY = 'jhumka_cart_v1'
    const ORDERS_KEY = 'jhumka_orders_v1'

    function loadCart(){
        try{ return JSON.parse(localStorage.getItem(CART_KEY)) || [] }catch(e){ return [] }
    }
    function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)) }

    function findAddButtons(){
        return Array.from(document.querySelectorAll('.add-to-cart'))
    }

    function createCartButton(){
        const btn = document.createElement('button')
        btn.className = 'cart-toggle'
        btn.innerHTML = '<i class="fas fa-shopping-bag"></i> <span class="count">0</span>'
        btn.style.position = 'fixed'
        btn.style.right = '20px'
        btn.style.bottom = '20px'
        btn.style.zIndex = 2000
        btn.style.background = 'linear-gradient(45deg,#D4AF37,#B4934C)'
        btn.style.color = '#fff'
        btn.style.border = 'none'
        btn.style.padding = '12px 16px'
        btn.style.borderRadius = '30px'
        btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)'
        btn.style.cursor = 'pointer'
        document.body.appendChild(btn)
        return btn
    }

    function createCartPanel(){
        const panel = document.createElement('aside')
        panel.className = 'cart-panel'
        panel.style.position = 'fixed'
        panel.style.right = '0'
        panel.style.top = '0'
        panel.style.height = '100%'
        panel.style.width = '360px'
        panel.style.maxWidth = '100%'
        panel.style.background = '#fff'
        panel.style.boxShadow = '0 0 40px rgba(0,0,0,0.2)'
        panel.style.transform = 'translateX(100%)'
        panel.style.transition = 'transform .35s ease'
        panel.style.zIndex = 2001
        panel.innerHTML = `
            <div style="padding:20px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
                <h3 style="margin:0;font-family:'Playfair Display',serif;">Handlekurv</h3>
                <button class="close-cart" style="background:none;border:none;font-size:18px;cursor:pointer">&times;</button>
            </div>
            <div class="cart-items" style="padding:16px;max-height:60vh;overflow:auto"></div>
            <div style="padding:16px;border-top:1px solid #eee">
                <div style="display:flex;justify-content:space-between;margin-bottom:12px"><strong>Totalt:</strong><strong class="cart-total">0 kr</strong></div>
                <a href="checkout.html" class="checkout-button" style="display:block;text-align:center;background:linear-gradient(45deg,#D4AF37,#B4934C);color:#fff;padding:12px;border-radius:8px;text-decoration:none;font-weight:600">Gå til kassen</a>
            </div>
        `
        document.body.appendChild(panel)
        return panel
    }

    function formatPrice(n){ return `${n} kr` }

    function renderCart(panel, cart){
        const container = panel.querySelector('.cart-items')
        container.innerHTML = ''
        let total = 0
        cart.forEach(item => {
            total += item.price * item.qty
            const row = document.createElement('div')
            row.style.display = 'flex'
            row.style.gap = '8px'
            row.style.marginBottom = '12px'
            row.innerHTML = `
                <img src="${item.image}" style="width:64px;height:64px;object-fit:cover;border-radius:6px;border:1px solid #eee">
                <div style="flex:1">
                    <div style="display:flex;justify-content:space-between"><strong>${item.name}</strong><small>${formatPrice(item.price)}</small></div>
                    <div style="display:flex;gap:8px;align-items:center;margin-top:8px">
                        <button class="dec" data-id="${item.id}" style="width:28px;height:28px">-</button>
                        <div>${item.qty}</div>
                        <button class="inc" data-id="${item.id}" style="width:28px;height:28px">+</button>
                        <button class="rm" data-id="${item.id}" style="margin-left:auto;background:none;border:none;color:#888;cursor:pointer">Fjern</button>
                    </div>
                </div>
            `
            container.appendChild(row)
        })
        panel.querySelector('.cart-total').textContent = formatPrice(total)
    }

    function openPanel(panel){ panel.style.transform = 'translateX(0)' }
    function closePanel(panel){ panel.style.transform = 'translateX(100%)' }

    function addToCartFromCard(button){
        const card = button.closest('.product-card')
        if(!card) return
        const id = card.getAttribute('data-id')
        const name = card.getAttribute('data-name') || card.querySelector('h3')?.textContent
        const price = parseFloat(card.getAttribute('data-price') || card.querySelector('.price')?.textContent.replace(/[^0-9.-]+/g, '')) || 0
        const image = card.getAttribute('data-image') || card.querySelector('img')?.getAttribute('src')
        const cart = loadCart()
        const existing = cart.find(i => i.id === id)
        if(existing){ existing.qty += 1 } else { cart.push({ id, name, price, image, qty: 1 }) }
        saveCart(cart)
        updateCartCount()
    }

    function updateCartCount(){
        const cart = loadCart()
        const count = cart.reduce((s,i)=> s + i.qty, 0)
        const btnCount = document.querySelector('.cart-toggle .count')
        if(btnCount) btnCount.textContent = count
    }

    function attachCartControls(panel){
        panel.addEventListener('click', (e) => {
            const target = e.target
            if(target.classList.contains('close-cart')){ closePanel(panel); return }
            if(target.classList.contains('inc') || target.classList.contains('dec') || target.classList.contains('rm')){
                const id = target.getAttribute('data-id')
                let cart = loadCart()
                const idx = cart.findIndex(i=>i.id===id)
                if(idx===-1) return
                if(target.classList.contains('inc')){ cart[idx].qty +=1 }
                if(target.classList.contains('dec')){ cart[idx].qty = Math.max(1, cart[idx].qty-1) }
                if(target.classList.contains('rm')){ cart.splice(idx,1) }
                saveCart(cart)
                renderCart(panel, cart)
                updateCartCount()
            }
        })
    }

    function wireAddButtons(){
        findAddButtons().forEach(btn => {
            btn.addEventListener('click', (e)=>{
                e.preventDefault()
                addToCartFromCard(btn)
                // quick animation
                const orig = btn.innerHTML
                btn.innerHTML = '<i class="fas fa-check"></i> Lagt til'
                setTimeout(()=> btn.innerHTML = orig, 1200)
            })
        })
    }

    // On checkout page, read cart and show order form handling
    function initCheckoutPage(){
        if(!document.body.classList.contains('checkout-page')) return
        const cart = loadCart()
        const list = document.getElementById('checkout-items')
        const totalEl = document.getElementById('checkout-total')
        if(list){
            list.innerHTML = ''
            let total=0
            cart.forEach(item=>{
                total += item.price * item.qty
                const li = document.createElement('li')
                li.textContent = `${item.name} x${item.qty} — ${item.price} kr` 
                list.appendChild(li)
            })
            if(totalEl) totalEl.textContent = `${total} kr`
        }
        const form = document.getElementById('checkout-form')
        if(form){
            form.addEventListener('submit', (e)=>{
                e.preventDefault()
                const data = Object.fromEntries(new FormData(form).entries())
                const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
                const id = 'ORD' + Date.now()
                orders.push({ id, date: new Date().toISOString(), cart, customer: data })
                localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
                localStorage.removeItem(CART_KEY)
                // show confirmation
                window.location.href = 'order-confirmation.html?order='+encodeURIComponent(id)
            })
        }
    }

    function initOrderConfirmation(){
        const q = new URLSearchParams(location.search)
        const id = q.get('order')
        if(!id) return
        const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')
        const ord = orders.find(o=>o.id===id)
        if(!ord) return
        const el = document.getElementById('order-details')
        if(!el) return
        el.innerHTML = `
            <h3>Ordre ${ord.id}</h3>
            <p>Dato: ${new Date(ord.date).toLocaleString()}</p>
            <h4>Kunde</h4>
            <p>${ord.customer.name}<br>${ord.customer.email}<br>${ord.customer.address}</p>
            <h4>Varer</h4>
            <ul>${ord.cart.map(i=>`<li>${i.name} x${i.qty} — ${i.price} kr</li>`).join('')}</ul>
        `
    }

    // Init
    document.addEventListener('DOMContentLoaded', ()=>{
        const cartBtn = createCartButton()
        const panel = createCartPanel()
        wireAddButtons()
        attachCartControls(panel)
        updateCartCount()

        cartBtn.addEventListener('click', ()=> openPanel(panel))

        // render from storage
        renderCart(panel, loadCart())

        // Init checkout page handling if present
        initCheckoutPage()
        initOrderConfirmation()
    })
})();
