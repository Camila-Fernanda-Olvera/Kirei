// Validación del formulario de login con SweetAlert2
const form = document.getElementById('loginForm');

if (form) {
    form.addEventListener('submit', function(e) {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        let valid = true;
        let msg = '';
        let icon = 'error';

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
            Swal.fire({
                title: 'Error de Validación',
                text: msg,
                icon: icon,
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#d72660',
                background: 'rgba(255,255,255,0.95)',
                backdrop: 'rgba(0,0,0,0.4)',
                customClass: {
                    popup: 'swal-custom-popup'
                }
            });
        }
    });
}

// Función para validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar mensajes de éxito
function showSuccess(message) {
    Swal.fire({
        title: '¡Éxito!',
        text: message,
        icon: 'success',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#d72660',
        background: 'rgba(255,255,255,0.95)',
        backdrop: 'rgba(0,0,0,0.4)',
        timer: 3000,
        timerProgressBar: true
    });
}

// Función para mostrar mensajes de error
function showError(message) {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d72660',
        background: 'rgba(255,255,255,0.95)',
        backdrop: 'rgba(0,0,0,0.4)'
    });
}

// Función para mostrar mensajes de información
function showInfo(message) {
    Swal.fire({
        title: 'Información',
        text: message,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d72660',
        background: 'rgba(255,255,255,0.95)',
        backdrop: 'rgba(0,0,0,0.4)'
    });
}
