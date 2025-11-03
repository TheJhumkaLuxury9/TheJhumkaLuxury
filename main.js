// Cart + checkout logic for The Jhumka Luxury
const CART_KEY = 'tj_cart_v2'

function getCart(){
  const raw = localStorage.getItem(CART_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  updateCartCount()
  updateSummary()
}

function addToCart(item){
  const cart = getCart()
  const found = cart.find(i=>i.id===item.id)
  if(found){ found.qty += 1 }
  else { cart.push({...item, qty:1}) }
  saveCart(cart)
}

function addToCartFromButton(btn){
  const art = btn.closest('.product')
  if(!art) return
  const item = {
    id: art.dataset.id,
    name: art.dataset.name,
    price: Number(art.dataset.price),
    image: art.dataset.image
  }
  addToCart(item)
  // small feedback
  btn.textContent = 'Lagt til✓'
  setTimeout(()=> btn.textContent = 'Legg i handlekurv', 900)
}

function updateCartCount(){
  const cart = getCart()
  const total = cart.reduce((s,i)=>s+i.qty,0)
  const el = document.getElementById('cart-count')
  if(el) el.textContent = total
}

function updateSummary(){
  const cart = getCart()
  const count = cart.reduce((s,i)=>s+i.qty,0)
  const total = cart.reduce((s,i)=>s+i.qty*i.price,0)
  const cEl = document.getElementById('summary-count')
  const tEl = document.getElementById('summary-total')
  if(cEl) cEl.textContent = count
  if(tEl) tEl.textContent = total + ' NOK'
}

function showCheckout(){
  const panel = document.getElementById('checkout-panel')
  const itemsEl = document.getElementById('checkout-items')
  const orderRefEl = document.getElementById('order-ref')
  const cart = getCart()
  if(!panel || !itemsEl || !orderRefEl) return
  itemsEl.innerHTML = ''
  cart.forEach(i=>{
    const div = document.createElement('div')
    div.textContent = `${i.name} x${i.qty} — ${i.qty * i.price} NOK`
    itemsEl.appendChild(div)
  })
  const ref = 'JH' + Date.now().toString().slice(-6)
  orderRefEl.textContent = ref
  panel.classList.remove('hidden')
}

// Initialize UI
window.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount()
  updateSummary()
  // optional: click handlers for direct add buttons (if any new dynamic items are added later)
  document.querySelectorAll('.product .btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      // handled by inline onclick already; keep for resilience
    })
  })
})
