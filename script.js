// 1. BASE DE DATOS DE PRODUCTOS
const products = [
    {
        id: 1,
        name: "Pulsera Aura Dorada",
        category: "Lujo",
        price: 2500,
        stock: 5,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=300" 
    },
    {
        id: 2,
        name: "Legado Boho",
        category: "Casual",
        price: 1200,
        stock: 12,
        image: "https://images.unsplash.com/photo-1573408301145-b98c46544405?auto=format&fit=crop&q=80&w=300"
    },
    {
        id: 3,
        name: "Minimalist Silver",
        category: "Elegante",
        price: 1800,
        stock: 0, // Al estar en 0, no dejará comprar
        image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10f1?auto=format&fit=crop&q=80&w=300"
    }
];

// 2. VARIABLES DE ESTADO Y ELEMENTOS DEL DOM
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Recupera el carrito si recargas la página

const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const toast = document.getElementById('toast');

// 3. FUNCIÓN PARA MOSTRAR LOS PRODUCTOS EN LA PANTALLA
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price-stock">
                    <span class="price">$${product.price}</span>
                    <span class="stock">${product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}</span>
                </div>
                <button class="btn btn-accent full-width" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Sin existencias' : 'Añadir al Carrito'}
                </button>
            </div>
        </div>
    `).join('');
}

// 4. FUNCIONES DEL CARRITO DE COMPRAS
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const itemInCart = cart.find(item => item.id === productId);

    if (itemInCart) {
        if (itemInCart.quantity < product.stock) {
            itemInCart.quantity++;
            showToast();
        } else {
            alert("No hay más stock disponible de este producto.");
        }
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast();
    }
    
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    // Actualizar la burbuja roja del icono
    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);

    // Renderizar los items dentro del carrito
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');

    // Actualizar el total de dinero a pagar
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.innerText = `$${total.toLocaleString()}`;
}

window.updateQty = function(productId, delta) {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);

    if (item) {
        if (delta > 0 && item.quantity < product.stock) {
            item.quantity++;
        } else if (delta < 0 && item.quantity > 1) {
            item.quantity--;
        } else if (delta < 0 && item.quantity === 1) {
            cart = cart.filter(i => i.id !== productId); // Lo elimina si la cantidad llega a 0
        }
    }
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// 5. EVENTOS DE ABRIR Y CERRAR EL MODAL
cartBtn.addEventListener('click', () => cartModal.style.display = 'block');
closeCart.addEventListener('click', () => cartModal.style.display = 'none');

// Cerrar carrito al hacer clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// 6. INICIALIZAR LA PÁGINA
renderProducts();
updateCartUI();