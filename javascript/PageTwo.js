/* ===================================
   PageTwo.js - Logic Giỏ Hàng (Chuyển hướng checkout.html)
   =================================== */

   document.addEventListener("DOMContentLoaded", function () {
    // === KHỞI TẠO CÁC PHẦN TỬ ===
    const addButtons = document.querySelectorAll(".btn-add");
    
    // Cart Modal
    // Mở giỏ hàng
const cartIcon = document.querySelector('.cart-icon');

cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    cartModal.classList.add("active");
    document.body.style.overflow = "hidden";
});

    const cartModal = document.querySelector("#cart-modal");
    const cartCloseBtn = document.querySelector(".cart-close-btn");
    const orderCountElement = document.querySelector("#order-count");
    const cartItemsList = document.querySelector(".cart-items-list");
    const cartTotalPriceElement = document.querySelector("#cart-total-price");
    const btnClearCart = document.querySelector(".btn-clear-cart");
    const btnCheckout = document.querySelector(".btn-checkout");
    
    // Khởi tạo giỏ hàng
    let order = JSON.parse(localStorage.getItem('cart')) || [];

    // === HÀM HỖ TRỢ ===
    function formatCurrency(amount) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(order));
    }

   // Dán code này vào file PageTwo.js, thay thế cho hàm updateCartUI() cũ

function updateCartUI() {
    const totalItems = order.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 1. Cập nhật số lượng badge (Bạn đã làm)
    orderCountElement.textContent = totalItems;
    
    if (totalItems > 0) {
        orderCountElement.style.display = "block";
        orderCountElement.classList.add("active");
    } else {
        orderCountElement.style.display = "none";
        orderCountElement.classList.remove("active");
    }

    // 2. ⭐ PHẦN BỊ THIẾU: Render danh sách items vào modal
    if (order.length === 0) {
        // Hiển thị thông báo khi giỏ hàng trống
        cartItemsList.innerHTML = `<li class="cart-empty-message" style="text-align: center; padding: 20px; color: #666;">Giỏ hàng của bạn đang trống.</li>`;
    } else {
        // Tạo HTML cho từng món hàng
        cartItemsList.innerHTML = order.map((item, index) => `
            <li class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed #eee;">
                <div class="item-info">
                    <div class="item-name" style="font-weight: 600;">${item.name}</div>
                    <div class="item-price" style="font-size: 0.9em; color: #666;">${formatCurrency(item.price)} x ${item.quantity}</div>
                </div>
                <div class_="item-actions" style="display: flex; align-items: center;">
                    <button class="btn-quantity btn-decrease" data-index="${index}" style="width: 25px; height: 25px; border: 1px solid #ccc; border-radius: 50%; cursor: pointer;">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="item-quantity" style="padding: 0 10px; font-weight: 600;">${item.quantity}</span>
                    <button class="btn-quantity btn-increase" data-index="${index}" style="width: 25px; height: 25px; border: 1px solid #ccc; border-radius: 50%; cursor: pointer;">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn-remove" data-index="${index}" style="width: 25px; height: 25px; border: none; background: #fff; color: red; cursor: pointer; margin-left: 10px;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </li>
        `).join("");
    }

    // 3. ⭐ PHẦN BỊ THIẾU: Cập nhật tổng tiền
    cartTotalPriceElement.textContent = formatCurrency(totalPrice);

    // 4. ⭐ QUAN TRỌNG: Kích hoạt lại các nút bấm trong giỏ hàng
    // (Vì innerHTML đã xóa các event cũ)
    attachCartEventListeners();

    // 5. Cập nhật nút trên card (Bạn đã làm)
    updateCocktailCardButtons();
    
    // 6. Lưu vào localStorage (Bạn đã làm)
    saveCart();
}

    function attachCartEventListeners() {
        // Nút tăng số lượng
        document.querySelectorAll(".btn-increase").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                order[index].quantity++;
                updateCartUI();
                showToast("Đã tăng số lượng", "success");
            });
        });

        // Nút giảm số lượng
        document.querySelectorAll(".btn-decrease").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                if (order[index].quantity > 1) {
                    order[index].quantity--;
                    updateCartUI();
                    showToast("Đã giảm số lượng", "info");
                } else {
                    // Nếu số lượng = 1, xóa món
                    removeItem(index);
                }
            });
        });

        // Nút xóa món
        document.querySelectorAll(".btn-remove").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                removeItem(index);
            });
        });
    }

    function removeItem(index) {
        const itemName = order[index].name;
        order.splice(index, 1);
        updateCartUI();
        showToast(`Đã xóa ${itemName}`, "warning");
    }

    function updateCocktailCardButtons() {
        addButtons.forEach(button => {
            const card = button.closest(".cocktail-card");
            const name = card.querySelector(".card-title").textContent;
            const existingItem = order.find(item => item.name === name);

            if (existingItem) {
                button.innerHTML = `
                    <i class="fas fa-check"></i>
                    <span class="btn-quantity-badge">${existingItem.quantity}</span>
                `;
                button.classList.add("added");
            } else {
                button.innerHTML = '<i class="fas fa-plus"></i>';
                button.classList.remove("added");
            }
        });
    }

    function showToast(message, type = "info") {
        // Xóa toast cũ nếu có
        const oldToast = document.querySelector(".toast-notification");
        if (oldToast) oldToast.remove();

        // Tạo toast mới
        const toast = document.createElement("div");
        toast.className = `toast-notification toast-${type}`;
        
        const icons = {
            success: "fa-check-circle",
            error: "fa-exclamation-circle",
            warning: "fa-exclamation-triangle",
            info: "fa-info-circle"
        };

        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Hiển thị toast
        setTimeout(() => toast.classList.add("show"), 100);

        // Tự động ẩn sau 3s
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // === SỰ KIỆN ===
    
    // Thêm vào giỏ hàng từ cocktail cards
    addButtons.forEach(button => {
        button.addEventListener("click", function () {
            const card = this.closest(".cocktail-card");
            const name = card.querySelector(".card-title").textContent;
            const priceText = card.querySelector(".card-price").textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, ""));

            const existingItem = order.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity++;
                showToast(`Đã thêm ${name} (x${existingItem.quantity})`, "success");
            } else {
                order.push({ name, price, quantity: 1 });
                showToast(`Đã thêm ${name} vào giỏ hàng`, "success");
            }

            updateCartUI();

            // Hiệu ứng button
            this.style.transform = "scale(1.2)";
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 200);
        });
    });

    // Mở giỏ hàng
    cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        cartModal.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    // Đóng giỏ hàng
    cartCloseBtn.addEventListener("click", () => {
        cartModal.classList.remove("active");
        document.body.style.overflow = "auto";
    });

    // Xóa toàn bộ giỏ hàng
    btnClearCart.addEventListener("click", () => {
        if (order.length === 0) return;
        
        if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
            order = [];
            updateCartUI();
            showToast("Đã xóa toàn bộ giỏ hàng", "warning");
        }
    });

    // ⭐ CHUYỂN SANG TRANG CHECKOUT.HTML
    btnCheckout.addEventListener("click", () => {
        if (order.length === 0) return;

        // Lưu giỏ hàng vào localStorage
        saveCart();
        
        // Chuyển hướng đến trang checkout
        window.location.href = "checkout.html";
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener("click", (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    // Đóng modal bằng phím ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cartModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    // Logout
    document.querySelector(".logout-btn").addEventListener("click", function() {
        if (order.length > 0) {
            if (!confirm("Bạn có đơn hàng chưa thanh toán. Bạn có chắc muốn đăng xuất?")) {
                return;
            }
        }
        
        if (confirm("Bạn có chắc muốn đăng xuất?")) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("cart");
            showToast("Đã đăng xuất", "info");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        }
    });

    // Khởi tạo ban đầu
    updateCartUI();
});