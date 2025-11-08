/* ===================================
   full-menu.js - Logic Giỏ Hàng cho trang Menu Đồ Ăn
   =================================== */

   document.addEventListener("DOMContentLoaded", function () {
    // === KHỞI TẠO CÁC PHẦN TỬ ===
    // *** THAY ĐỔI: Selector nút bấm mới
    const addButtons = document.querySelectorAll(".btn-add-item"); 
    
    // Cart Modal (Giữ nguyên)
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector("#cart-modal");
    const cartCloseBtn = document.querySelector(".cart-close-btn");
    const orderCountElement = document.querySelector("#order-count");
    const cartItemsList = document.querySelector(".cart-items-list");
    const cartTotalPriceElement = document.querySelector("#cart-total-price");
    const btnClearCart = document.querySelector(".btn-clear-cart");
    const btnCheckout = document.querySelector(".btn-checkout");
    
    // Khởi tạo giỏ hàng (Dùng chung localStorage 'cart')
    let order = JSON.parse(localStorage.getItem('cart')) || [];

    // === HÀM HỖ TRỢ === (Giữ nguyên)
    function formatCurrency(amount) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(order));
    }

    // === HÀM UPDATE UI (Đã chỉnh sửa) ===
    function updateCartUI() {
        const totalItems = order.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
        // 1. Cập nhật số lượng badge
        orderCountElement.textContent = totalItems;
        if (totalItems > 0) {
            orderCountElement.style.display = "block";
            orderCountElement.classList.add("active");
        } else {
            orderCountElement.style.display = "none";
            orderCountElement.classList.remove("active");
        }

        // 2. Render danh sách items vào modal
        if (order.length === 0) {
            cartItemsList.innerHTML = `<li class="cart-empty-message" style="text-align: center; padding: 20px; color: #666;">Giỏ hàng của bạn đang trống.</li>`;
        } else {
            cartItemsList.innerHTML = order.map((item, index) => `
                <li class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed #eee;">
                    <div class="item-info">
                        <div class="item-name" style="font-weight: 600;">${item.name}</div>
                        <div class="item-price" style="font-size: 0.9em; color: #666;">${formatCurrency(item.price)} x ${item.quantity}</div>
                    </div>
                    <div class="item-actions" style="display: flex; align-items: center;">
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

        // 3. Cập nhật tổng tiền
        cartTotalPriceElement.textContent = formatCurrency(totalPrice);

        // 4. Kích hoạt lại các nút bấm trong giỏ hàng
        attachCartEventListeners();

        // 5. *** THAY ĐỔI: Cập nhật nút trên card MÓN ĂN
        updateMenuCardButtons();
        
        // 6. Lưu vào localStorage
        saveCart();
    }

    // === HÀM EVENT LISTENERS (Giữ nguyên) ===
    function attachCartEventListeners() {
        document.querySelectorAll(".btn-increase").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                order[index].quantity++;
                updateCartUI();
                showToast("Đã tăng số lượng", "success");
            });
        });

        document.querySelectorAll(".btn-decrease").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                if (order[index].quantity > 1) {
                    order[index].quantity--;
                    updateCartUI();
                    showToast("Đã giảm số lượng", "info");
                } else {
                    removeItem(index);
                }
            });
        });

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

    // === HÀM UPDATE NÚT (Đã chỉnh sửa) ===
    function updateMenuCardButtons() { // *** ĐỔI TÊN HÀM
        addButtons.forEach(button => {
            // *** THAY ĐỔI: Selector thẻ card mới
            const card = button.closest(".menu-item-card"); 
            const name = card.querySelector(".item-name").textContent; // *** THAY ĐỔI
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

    // === HÀM TOAST (Giữ nguyên) ===
    function showToast(message, type = "info") {
        const oldToast = document.querySelector(".toast-notification");
        if (oldToast) oldToast.remove();

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
        setTimeout(() => toast.classList.add("show"), 100);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // === SỰ KIỆN ===
    
    // *** THAY ĐỔI: Thêm vào giỏ hàng từ card MÓN ĂN
    addButtons.forEach(button => {
        button.addEventListener("click", function () {
            const card = this.closest(".menu-item-card"); // *** THAY ĐỔI
            const name = card.querySelector(".item-name").textContent; // *** THAY ĐỔI
            const priceText = card.querySelector(".item-price").textContent; // *** THAY ĐỔI
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

            this.style.transform = "scale(1.2)";
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 200);
        });
    });

    // Mở giỏ hàng (Giữ nguyên)
    cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        cartModal.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    // Đóng giỏ hàng (Giữ nguyên)
    cartCloseBtn.addEventListener("click", () => {
        cartModal.classList.remove("active");
        document.body.style.overflow = "auto";
    });

    // Xóa toàn bộ giỏ hàng (Giữ nguyên)
    btnClearCart.addEventListener("click", () => {
        if (order.length === 0) return;
        
        if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
            order = [];
            updateCartUI();
            showToast("Đã xóa toàn bộ giỏ hàng", "warning");
        }
    });

    // CHUYỂN SANG TRANG CHECKOUT.HTML (Giữ nguyên)
    btnCheckout.addEventListener("click", () => {
        if (order.length === 0) return;
        saveCart();
        window.location.href = "checkout.html";
    });

    // Đóng modal (Giữ nguyên)
    window.addEventListener("click", (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cartModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    // (XÓA PHẦN LOGOUT VÌ ĐÃ CÓ SCRIPT RIÊNG TRONG HTML)

    // Khởi tạo ban đầu
    updateCartUI();
});