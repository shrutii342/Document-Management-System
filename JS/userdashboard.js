// Example JavaScript for User Dashboard
// You can expand this based on your project requirements

document.getElementById('quick-upload').onclick = function() {
    alert('Upload Document clicked! (Add your upload logic here)');
};
document.getElementById('quick-view').onclick = function() {
    alert('View Documents clicked! (Add your view logic here)');
};
document.getElementById('upload-btn').onclick = function() {
    alert('Upload Document from sidebar!');
};
document.getElementById('view-btn').onclick = function() {
    alert('View Documents from sidebar!');
};
document.getElementById('logout-btn').onclick = function() {
    // Clear session/local storage (example for JWT or session-based auth)
    localStorage.clear();
    sessionStorage.clear();
    alert('You have been logged out.');
    // Redirect to login page
    window.location.href = 'LogIn.html';
};
// You can add logic to dynamically update user info and recent activity.
