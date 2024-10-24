document.addEventListener('DOMContentLoaded', function () {
    // Check if there's an error in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const errorType = urlParams.get('error');

    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        let message = '';
        switch (errorType) {
            case 'empty-fields':
                message = 'Please fill in all fields.';
                break;
            case 'email-in-use':
                message = 'Email already in use.';
                break;
            case 'username-taken':
                message = 'Username already taken.';
                break;
            case 'server-error':
                message = 'Server error. Please try again later.';
                break;
            case 'registration-error':
                message = 'Error during registration. Please try again.';
                break;
            case 'invalid-credential':
                message = 'Invalid Username or Password';
                break;
            case 'user-not-found':
                message = 'User not found';
                break;
            default:
                message = '';
        }
        if (message) {
            messageContainer.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
});
