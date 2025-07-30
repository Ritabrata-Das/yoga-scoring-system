document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#login form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Login functionality will be implemented in the backend.');
        });
    }
});
