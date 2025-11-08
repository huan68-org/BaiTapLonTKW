/* ===================================
   CHECKOUT.JS - Logic Thanh Toán (Order tại bàn)
   =================================== */

   document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu giỏ hàng từ localStorage
    let order = JSON.parse(localStorage.getItem('cart')) || [];

    // Kiểm tra giỏ hàng trống
    if (order.length === 0) {
        showToast("Giỏ hàng trống! Đang chuyển về menu...", "warning");
        setTimeout(() => {
            window.location.href = "PageTwo.html";
        }, 2000);
        return;
    }

    // === KHỞI TẠO CÁC PHẦN TỬ ===
    const orderItemsContainer = document.querySelector("#order-items");
    const subtotalElement = document.querySelector("#subtotal");
    const serviceFeeElement = document.querySelector("#service-fee");
    const vatElement = document.querySelector("#vat");
    const totalPriceElement = document.querySelector("#total-price");
    const checkoutForm = document.querySelector("#checkout-form");
    const successModal = document.querySelector("#success-modal");
    const orderCodeElement = document.querySelector("#order-code");

    // === HÀM HỖ TRỢ ===
    function formatCurrency(amount) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    }

    function showToast(message, type = "info") {
        const toastContainer = document.querySelector("#toast-container");
        
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
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

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = "slideOutRight 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function generateOrderCode() {
        const prefix = "FTM";
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }

    function validateForm(formData) {
        const errors = [];

        // Validate phone
        const phone = formData.get('phone');
        if (!/^[0-9]{10}$/.test(phone)) {
            errors.push("Số điện thoại phải có 10 chữ số");
        }

        // Validate email
        const email = formData.get('email');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Email không hợp lệ");
        }

        // *** THAY ĐỔI: Validate SỐ BÀN ***
        const tableNumber = formData.get('table-number');
        if (!tableNumber || parseInt(tableNumber, 10) < 1) {
            errors.push("Vui lòng nhập số bàn hợp lệ (lớn hơn 0)");
        }

        return errors;
    }

    // === RENDER ĐƠN HÀNG ===
    function renderOrder() {
        // Render items
        orderItemsContainer.innerHTML = order.map(item => `
            <div class="order-item">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Số lượng: ${item.quantity}</div>
                </div>
                <div class="item-price">${formatCurrency(item.price * item.quantity)}</div>
            </div>
        `).join("");

        // Tính toán giá
        const subtotal = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const serviceFee = subtotal * 0.05;
        const vat = subtotal * 0.1;
        const total = subtotal + serviceFee + vat;

        // Hiển thị giá
        subtotalElement.textContent = formatCurrency(subtotal);
        serviceFeeElement.textContent = formatCurrency(serviceFee);
        vatElement.textContent = formatCurrency(vat);
        totalPriceElement.textContent = formatCurrency(total);
    }

    // === XỬ LÝ FORM ===
    checkoutForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // Validate
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showToast(errors.join(", "), "error");
            return;
        }

        // Tính toán
        const subtotal = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const serviceFee = subtotal * 0.05;
        const vat = subtotal * 0.1;
        const total = subtotal + serviceFee + vat;

        // Tạo đơn hàng
        const orderData = {
            code: generateOrderCode(),
            customer: {
                name: formData.get('fullname'),
                phone: formData.get('phone'),
                email: formData.get('email'),
            },
            // *** THAY ĐỔI: Thay booking bằng tableNumber ***
            tableInfo: {
                number: formData.get('table-number')
            },
            items: order,
            payment: {
                method: formData.get('payment'),
                subtotal: subtotal,
                serviceFee: serviceFee,
                vat: vat,
                total: total
            },
            note: formData.get('note') || "Không có ghi chú",
            timestamp: new Date().toISOString(),
            status: "pending_at_table" // Status mới
        };

        // Log & Save
        console.log("=== ĐƠN HÀNG MỚI (TẠI BÀN) ===");
        console.log(JSON.stringify(orderData, null, 2));

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Xóa giỏ hàng
        localStorage.removeItem('cart');

        // Hiển thị success
        orderCodeElement.textContent = orderData.code;
        successModal.classList.add("active");
        document.body.style.overflow = "hidden";

        // Reset form
        this.reset();
    });

    // *** ĐÃ XÓA: PHẦN SET NGÀY TỐI THIỂU ***

    // === LOGOUT ===
    document.querySelector(".logout-btn").addEventListener("click", function() {
        if (confirm("Bạn có chắc muốn đăng xuất? Giỏ hàng hiện tại sẽ bị xóa.")) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("cart");
            showToast("Đã đăng xuất", "info");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        }
    });

    // === KHỞI TẠO ===
    renderOrder();
});