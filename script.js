// Мобильное меню
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(item => {
    item.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Изменение навигационной панели при прокрутке
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '0';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.padding = '0';
        header.style.boxShadow = 'none';
    }
});

// Фильтрация товаров
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Очистка активного класса
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Получаем значение фильтра
        const filterValue = button.getAttribute('data-filter');
        
        // Фильтруем товары
        productCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Корзина - глобальные переменные
let cartProducts = [];
let cartItems = 0;
const cartCount = document.querySelector('.cart span');
const cartModal = document.getElementById('cart-modal');
const cartLink = document.querySelector('.cart a');
const closeModal = document.querySelector('.close-modal');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Функция обновления счетчика корзины
function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = cartItems;
        
        // Анимация счетчика
        cartCount.classList.add('pulse');
        setTimeout(() => {
            cartCount.classList.remove('pulse');
        }, 300);
    }
}

// Функция открытия модального окна корзины
function openCartModal() {
    if (cartModal) {
        updateCartDisplay();
        cartModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
    }
}

// Функция закрытия модального окна корзины
function closeCartModal() {
    if (cartModal) {
        cartModal.classList.remove('show');
        document.body.style.overflow = ''; // Возвращаем прокрутку страницы
    }
}

// Функция обновления отображения товаров в корзине
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-price');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    // Очищаем контейнер
    cartItemsContainer.innerHTML = '';
    
    if (cartProducts.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        cartTotalElement.textContent = '0 ₽';
        return;
    }
    
    // Добавляем товары
    let totalPrice = 0;
    
    cartProducts.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        
        // Извлекаем числовое значение цены
        const priceText = product.price || '0 ₽';
        const priceValue = parseInt(priceText.replace(/\D/g, '')) || 0;
        totalPrice += priceValue;
        
        productElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${product.name}</div>
                <div class="cart-item-price">${product.price}</div>
            </div>
            <button class="cart-item-remove" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsContainer.appendChild(productElement);
    });
    
    // Форматируем итоговую цену
    cartTotalElement.textContent = `${totalPrice.toLocaleString()} ₽`;
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Функция удаления товара из корзины
function removeFromCart(index) {
    cartProducts.splice(index, 1);
    cartItems = cartProducts.length;
    
    // Обновляем localStorage
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    localStorage.setItem('cartItems', cartItems);
    
    // Обновляем счетчик и отображение корзины
    updateCartCount();
    updateCartDisplay();
    
    // Показываем уведомление
    showNotification('Товар удален из корзины');
}

// Функция добавления товара в корзину
function addToCart(productCard) {
    if (!productCard) return;
    
    const productName = productCard.querySelector('h3')?.textContent || 'Товар';
    const productPrice = productCard.querySelector('.price')?.textContent || '0 ₽';
    const productImage = productCard.querySelector('img')?.src || '';
    
    // Добавляем товар в массив корзины
    cartProducts.push({
        name: productName,
        price: productPrice,
        image: productImage
    });
    
    // Обновляем счетчик
    cartItems = cartProducts.length;
    updateCartCount();
    
    // Сохраняем в localStorage
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    localStorage.setItem('cartItems', cartItems);
    
    // Показываем уведомление
    showNotification(`${productName} добавлен в корзину`);
}

// Инициализация корзины при загрузке страницы
function initCart() {
    // Восстанавливаем данные из localStorage
    cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
    cartItems = cartProducts.length;
    localStorage.setItem('cartItems', cartItems);
    updateCartCount();
    
    console.log('Инициализация корзины:', cartProducts.length, 'товаров');
}

// Добавляем обработчик событий после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    initCart();
    
    // Кнопка корзины в шапке
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Открытие корзины');
            openCartModal();
        });
    }
    
    // Закрытие модального окна
    if (closeModal) {
        closeModal.addEventListener('click', closeCartModal);
    }
    
    // Закрытие модального окна при клике вне его области
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
    
    // Добавление товаров в корзину
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            console.log('Добавление товара:', productCard.querySelector('h3').textContent);
            addToCart(productCard);
            
            // Анимация кнопки
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 300);
        });
    });
    
// ... existing code ...

// Кнопка оформления заказа
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cartProducts.length === 0) {
            showNotification('Корзина пуста. Добавьте товары для оформления заказа.');
            return;
        }
        
        showNotification('Переход к оформлению заказа...');
        
        // Перенаправляем на страницу оформления заказа
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 500);
    });
}

    
    console.log('Обработчики событий корзины установлены');
});

// Проверка наличия уведомлений
function showNotification(message) {
    // Проверяем, существует ли уже уведомление
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Обновляем сообщение и показываем уведомление
    notification.textContent = message;
    notification.classList.add('show');
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Добавляем стили для уведомления и анимации
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .add-to-cart.active {
        animation: pulse 0.3s ease;
    }
    
    .cart span.pulse {
        animation: pulse 0.3s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Обработка формы обратной связи
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // В реальном проекте здесь был бы AJAX-запрос для отправки данных
        console.log('Данные формы:', { name, email, message });
        
        // Показываем уведомление об успешной отправке
        showNotification('Сообщение успешно отправлено!');
        
        // Очищаем форму
        this.reset();
    });
}

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Учитываем высоту шапки
                behavior: 'smooth'
            });
        }
    });
});

// Добавляем активный класс к пунктам меню при прокрутке
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Анимация появления элементов при прокрутке
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.product-card, .feature-card, .review-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (elementPosition < screenPosition - 100) {
            element.classList.add('fade-in');
        }
    });
};

// Добавляем стили для анимации
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    .product-card, .feature-card, .review-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(fadeStyle);

// Запускаем анимацию при загрузке и прокрутке
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Добавляем стили для модального окна корзины
const modalStyle = document.createElement('style');
modalStyle.textContent = `
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 1010;
        overflow: auto;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal.show {
        display: block;
        opacity: 1;
    }
    
    .modal-content {
        background-color: var(--dark-color);
        margin: 10% auto;
        max-width: 500px;
        border-radius: 10px;
        box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
        transform: translateY(-50px);
        transition: transform 0.3s ease;
        overflow: hidden;
    }
    
    .modal.show .modal-content {
        transform: translateY(0);
    }
    
    .modal-header {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .close-modal {
        color: var(--light-text);
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .close-modal:hover {
        color: var(--primary-color);
    }
    
    .modal-body {
        padding: 20px;
    }
    
    #cart-items {
        margin-bottom: 20px;
    }
    
    .cart-item {
        display: flex;
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cart-item-image {
        width: 60px;
        height: 60px;
        overflow: hidden;
        border-radius: 5px;
        margin-right: 15px;
    }
    
    .cart-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .cart-item-info {
        flex: 1;
    }
    
    .cart-item-name {
        font-weight: 700;
        margin-bottom: 5px;
        color: var(--text-color);
    }
    
    .cart-item-price {
        color: var(--light-text);
        font-size: 0.9rem;
    }
    
    .cart-item-remove {
        color: #ff4757;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
        margin-left: 10px;
        font-size: 1.2rem;
        transition: transform 0.3s ease;
    }
    
    .cart-item-remove:hover {
        transform: scale(1.1);
    }
    
    .empty-cart {
        text-align: center;
        color: var(--light-text);
        padding: 30px 0;
    }
    
    .cart-total {
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 20px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .checkout-btn {
        width: 100%;
    }
`;
document.head.appendChild(modalStyle); 