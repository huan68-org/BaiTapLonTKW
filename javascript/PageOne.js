/* ===================================
   PageOne.js - Menu & Cart Logic
   =================================== */

   document.addEventListener("DOMContentLoaded", function () {
    // === DATA MENU ===
    const menuData = {
        food: [
            { name: "Bò Beefsteak", price: 350000, image: "./images/food1.jpg", desc: "Thịt bò Úc cao cấp nướng chín vừa" },
            { name: "Sushi Nhật Bản", price: 280000, image: "./images/food2.jpg", desc: "Sushi cá hồi tươi ngon" },
            { name: "Pasta Ý", price: 220000, image: "./images/food3.jpg", desc: "Mì Ý sốt kem nấm truffle" },
            { name: "Gà Teriyaki", price: 180000, image: "./images/food4.jpg", desc: "Gà nướng sốt Teriyaki Nhật Bản" },
            { name: "Tôm Hùm Nướng", price: 550000, image: "./images/food5.jpg", desc: "Tôm hùm baby nướng bơ tỏi" },
            { name: "Cá Hồi Áp Chảo", price: 320000, image: "./images/food6.jpg", desc: "Cá hồi Na Uy áp chảo bơ" },
            { name: "Sườn Nướng BBQ", price: 290000, image: "./images/food7.jpg", desc: "Sườn heo nướng sốt BBQ" },
            { name: "Burger Wagyu", price: 250000, image: "./images/food8.jpg", desc: "Burger thịt bò Wagyu cao cấp" },
            { name: "Pizza Hải Sản", price: 270000, image: "./images/food9.jpg", desc: "Pizza hải sản tươi sống" }
        ],
        drinks: [
            { name: "Mojito", price: 120000, image: "./images/drink1.jpg", desc: "Cocktail bạc hà chanh tươi mát" },
            { name: "Margarita", price: 130000, image: "./images/drink2.jpg", desc: "Cocktail Tequila cổ điển" },
            { name: "Whiskey Sour", price: 150000, image: "./images/drink3.jpg", desc: "Whiskey pha chanh tươi" },
            { name: "Piña Colada", price: 140000, image: "./images/drink4.jpg", desc: "Cocktail dứa dừa nhiệt đới" },
            { name: "Long Island", price: 160000, image: "./images/drink5.jpg", desc: "Cocktail 5 loại rượu mạnh" },
            { name: "Blue Lagoon", price: 125000, image: "./images/drink6.jpg", desc: "Cocktail xanh biển độc đáo" },
            { name: "Sex on the Beach", price: 135000, image: "./images/drink7.jpg", desc: "Cocktail đào cam ngọt ngào" },
            { name: "Cosmopolitan", price: 145000, image: "./images/drink8.jpg", desc: "Cocktail nam việt quất thanh lịch" },
            { name: "Mai Tai", price: 155000, image: "./images/drink9.jpg", desc: "Cocktail rum nhiệt đới" }
        ],
        dessert: [
            { name: "Tiramisu", price: 95000, image: "./images/dessert1.jpg", desc: "Bánh Tiramisu Ý truyền thống" },
            { name: "Panna Cotta", price: 85000, image: "./images/dessert2.jpg", desc: "Pudding Ý sốt dâu tây" },
            { name: "Crème Brûlée", price: 90000, image: "./images/dessert3.jpg", desc: "Bánh kem Pháp caramel" },
            { name: "Chocolate Lava", price: 105000, image: "./images/dessert4.jpg", desc: "Bánh chocolate chảy nóng" },
            { name: "Cheesecake", price: 88000, image: "./images/dessert5.jpg", desc: "Bánh phô mai New York" },
            { name: "Macaron", price: 75000, image: "./images/dessert6.jpg", desc: "Bánh macaron Pháp nhiều vị" },
            { name: "Gelato", price: 65000, image: "./images/dessert7.jpg", desc: "Kem Ý thủ công" },
            { name: "Mousse Chocolate", price: 92000, image: "./images/dessert8.jpg", desc: "Mousse chocolate đắng ngọt" },
            { name: "Fruit Tart", price: 98000, image: "./images/dessert9.jpg", desc: "Bánh tart trái cây tươi" }
        ]
    };

    // === KHỞI TẠO ===
    const btnExploreMenu = document.querySelector("#btn-explore-menu");
    const menuModal = document.querySelector("#menu-modal");
    const menuCloseBtn = document.querySelector(".menu-close-btn");
    const menuTabs = document.querySelectorAll(".menu-tab");
    const menuItemsGrid = document.querySelector("#menu-items-grid");
    
    const cartIconPage1 = document.querySelector("#cart-icon-page1");
    const cartModalPage1 = document.querySelector("#cart-modal-page1");
    const cartCloseBtn = document.querySelector(".cart-close-btn-page1");
    const cartCountPage1 = document.querySelector("#cart-count-page1");
    const cartItemsList = document.querySelector(".cart-items-list-page1");
    const cartTotalPage1 = document.querySelector("#cart-total-page1");
    const btnClearCart = document.querySelector(".btn-clear-cart-page1");
    const btnCheckout = document.querySelector(".btn-checkout-page1");
    
    let cart = [];
    let currentCategory = "food";

    // === HÀM ===
    function formatCurrency(amount) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    }

    function renderMenuItems(category) {
        const items = menuData[category];
        menuItemsGrid.innerHTML = items.map(item => `
            <div class="menu-item-card">
                <img src="${item.image}" alt="${item.name}" class="menu-item-image" 
                     onerror="this.src='./images/placeholder.jpg'">
                <div class="menu-item-info">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <p class="menu-item-desc">${item.desc}</p>
                    <div class="menu-item-footer">
                        <span class="menu-item-price">${formatCurrency(item.price)}</span>
                        <button class="btn-add-menu" data-name="${item.name}" data-price="${item.price}">
                            <i class="fas fa-plus"></i>
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        `).join("");

        // Gắn sự kiện cho nút Thêm
        document.querySelectorAll(".btn-add-menu").forEach(btn => {
            btn.addEventListener("click", handleAddToCart);
        });
    }

    function handleAddToCart(e) {
        const name = e.currentTarget.dataset.name;
        const price = parseInt(e.currentTarget.dataset.price);

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCartUI();

        // Hiệu ứng
        e.currentTarget.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        e.currentTarget.style.background = "var(--success-color)";
        
        setTimeout(() => {
            e.currentTarget.innerHTML = '<i class="fas fa-plus"></i> Thêm';
            e.currentTarget.style.background = "";
        }, 1500);
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        cartCountPage1.textContent = totalItems;
        cartCountPage1.style.display = totalItems > 0 ? "block" : "none";
        cartTotalPage1.textContent = formatCurrency(totalPrice);

        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Giỏ hàng trống</p>
                </div>
            `;
            btnCheckout.disabled = true;
            btnCheckout.style.opacity = "0.5";
        } else {
            cartItemsList.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p class="item-price">${formatCurrency(item.price)}</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn-quantity" data-action="decrease" data-index="${index}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="btn-quantity" data-action="increase" data-index="${index}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn-remove" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join("");

            btnCheckout.disabled = false;
            btnCheckout.style.opacity = "1";

            // Gắn sự kiện
            document.querySelectorAll(".btn-quantity").forEach(btn => {
                btn.addEventListener("click", handleQuantityChange);
            });

            document.querySelectorAll(".btn-remove").forEach(btn => {
                btn.addEventListener("click", handleRemoveItem);
            });
        }
    }

    function handleQuantityChange(e) {
        const index = parseInt(e.currentTarget.dataset.index);
        const action = e.currentTarget.dataset.action;

        if (action === "increase") {
            cart[index].quantity++;
        } else if (action === "decrease" && cart[index].quantity > 1) {
            cart[index].quantity--;
        }

        updateCartUI();
    }

    function handleRemoveItem(e) {
        const index = parseInt(e.currentTarget.dataset.index);
        cart.splice(index, 1);
        updateCartUI();
    }

    // === SỰ KIỆN ===
    btnExploreMenu.addEventListener("click", () => {
        menuModal.classList.add("active");
        renderMenuItems(currentCategory);
    });

    menuCloseBtn.addEventListener("click", () => {
        menuModal.classList.remove("active");
    });

    menuTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            menuTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentCategory = tab.dataset.category;
            renderMenuItems(currentCategory);
        });
    });

    cartIconPage1.addEventListener("click", (e) => {
        e.preventDefault();
        cartModalPage1.classList.add("active");
    });

    cartCloseBtn.addEventListener("click", () => {
        cartModalPage1.classList.remove("active");
    });

    btnClearCart.addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
            cart = [];
            updateCartUI();
        }
    });

    btnCheckout.addEventListener("click", () => {
        alert("Chức năng thanh toán đang được phát triển!");
        // Có thể chuyển sang checkout modal như PageTwo
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener("click", (e) => {
        if (e.target === menuModal) {
            menuModal.classList.remove("active");
        }
        if (e.target === cartModalPage1) {
            cartModalPage1.classList.remove("active");
        }
    });

    // Logout
    document.querySelector(".logout-btn").addEventListener("click", function() {
        if (confirm("Bạn có chắc muốn đăng xuất?")) {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "login.html";
        }
    });
});
