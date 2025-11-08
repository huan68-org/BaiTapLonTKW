// ===== TOGGLE PASSWORD =====
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// ===== LOGIN FORM =====
const loginForm = document.querySelector('#loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // LẤY GIÁ TRỊ
        const email = this.querySelector('input[type="email"]').value.trim();
        const password = this.querySelector('input[type="password"]').value;
        
        // VALIDATE ĐƠN GIẢN
        if (!email || !password) {
            alert('⚠️ Vui lòng điền đầy đủ thông tin!');
            return;
        }
        
        // Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('⚠️ Email không hợp lệ!');
            return;
        }
        
        // LƯU VÀO LOCALSTORAGE
        localStorage.setItem('currentUser', JSON.stringify({
            email: email,
            loggedIn: true,
            loginTime: new Date().toISOString()
        }));
        
        // REDIRECT VỀ PAGEONE.HTML
        alert('✅ Đăng nhập thành công!');
        window.location.href = 'PageOne.html';
    });
}

// ===== SIGNUP FORM =====
const signupForm = document.querySelector('#signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // LẤY GIÁ TRỊ
        const fullname = this.querySelector('#fullname').value.trim();
        const email = this.querySelector('#email').value.trim();
        const password = this.querySelector('#password').value;
        const confirmPassword = this.querySelector('#confirmPassword').value;
        const terms = this.querySelector('#terms').checked;
        
        // VALIDATE
        if (!fullname || !email || !password || !confirmPassword) {
            alert('⚠️ Vui lòng điền đầy đủ thông tin!');
            return;
        }
        
        // Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('⚠️ Email không hợp lệ!');
            return;
        }
        
        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            alert('⚠️ Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }
        
        // Kiểm tra mật khẩu khớp
        if (password !== confirmPassword) {
            alert('⚠️ Mật khẩu không khớp!');
            return;
        }
        
        // Kiểm tra điều khoản
        if (!terms) {
            alert('⚠️ Vui lòng đồng ý với điều khoản sử dụng!');
            return;
        }
        
        // LƯU VÀO LOCALSTORAGE
        localStorage.setItem('currentUser', JSON.stringify({
            fullName: fullname,
            email: email,
            loggedIn: true,
            registerTime: new Date().toISOString()
        }));
        
        // REDIRECT VỀ PAGEONE.HTML
        alert('✅ Đăng ký thành công! Chào mừng ' + fullname + '!');
        window.location.href = 'PageOne.html';
    });
}

// ===== SOCIAL LOGIN =====
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const platform = this.getAttribute('data-platform');
        
        // Hiển thị loading
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.disabled = true;
        
        // Giả lập đăng nhập social (delay 1s)
        setTimeout(() => {
            // LƯU VÀO LOCALSTORAGE
            localStorage.setItem('currentUser', JSON.stringify({
                email: `user@${platform}.com`,
                fullName: `${platform.charAt(0).toUpperCase() + platform.slice(1)} User`,
                loggedIn: true,
                platform: platform,
                loginTime: new Date().toISOString()
            }));
            
            // REDIRECT VỀ PAGEONE.HTML
            alert(`✅ Đăng nhập bằng ${platform.toUpperCase()} thành công!`);
            window.location.href = 'PageOne.html';
        }, 1000);
    });
});

// ===== AUTO-FILL FROM LOCALSTORAGE (Remember Me) =====
window.addEventListener('DOMContentLoaded', function() {
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe && loginForm) {
        const data = JSON.parse(rememberMe);
        loginForm.querySelector('input[type="email"]').value = data.email;
        loginForm.querySelector('#remember').checked = true;
    }
});

// ===== SAVE REMEMBER ME =====
if (loginForm) {
    const rememberCheckbox = loginForm.querySelector('#remember');
    if (rememberCheckbox) {
        loginForm.addEventListener('submit', function() {
            const email = this.querySelector('input[type="email"]').value;
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberMe', JSON.stringify({ email: email }));
            } else {
                localStorage.removeItem('rememberMe');
            }
        });
    }
}
