// Login logic for LogIn.html

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('.btn');
    loginBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok && data.token) {
                // Save JWT to localStorage
                localStorage.setItem('jwt_token', data.token);
                // Optionally save user info
                localStorage.setItem('user_name', data.username);
                localStorage.setItem('user_email', data.email);
                // Mark user as logged in for dashboard protection
                localStorage.setItem('isLoggedIn', 'true');
                // Redirect to dashboard
                window.location.href = 'UserDashboard.html';
            } else {
                alert(data.message || 'Login failed.');
            }
        } catch (err) {
            alert('Server error. Please try again later.');
        }
    });
});
