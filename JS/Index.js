// Validación del formulario de login
const form = document.getElementById('loginForm');

if (form) {
    form.addEventListener('submit', function(e) {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        let valid = true;
        let msg = '';

        if (!email) {
            valid = false;
            msg = 'El correo es obligatorio.';
        } else if (!isValidEmail(email)) {
            valid = false;
            msg = 'Ingresa un correo válido.';
        } else if (!password || password.length < 6) {
            valid = false;
            msg = 'La contraseña debe tener al menos 6 caracteres.';
        }

        if (!valid) {
            e.preventDefault();
            alert(msg);
        }
    });
}

// Función para validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
