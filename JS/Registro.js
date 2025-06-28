// Validación básica del formulario de registro
const form = document.getElementById('registerForm');
if (form) {
    form.addEventListener('submit', function(e) {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        let valid = true;
        let msg = '';
        if (!nombre) {
            valid = false;
            msg = 'El nombre es obligatorio.';
        } else if (!email) {
            valid = false;
            msg = 'El correo es obligatorio.';
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
