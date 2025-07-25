// Signup logic for SignUp.html

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        // Collect form data
        const username = document.getElementById('firstname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm password').value;
        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Registration successful! Please log in.');
                window.location.href = 'LogIn.html';
            } else {
                alert(data.message || 'Registration failed.');
            }
        } catch (err) {
            alert('Server error. Please try again later.');
        }
    });
});
