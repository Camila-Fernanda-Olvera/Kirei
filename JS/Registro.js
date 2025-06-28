// Validación del formulario de registro con SweetAlert2
const form = document.getElementById('registerForm');
const pacienteRadio = document.getElementById('paciente');
const familiarRadio = document.getElementById('familiar');
const padecimientoGroup = document.getElementById('padecimiento-group');
const padecimientoSelect = document.getElementById('padecimiento');

// Mostrar/ocultar campo de padecimiento según tipo de usuario
function togglePadecimiento() {
    if (pacienteRadio.checked) {
        padecimientoGroup.style.display = 'flex';
        padecimientoSelect.required = true;
    } else {
        padecimientoGroup.style.display = 'none';
        padecimientoSelect.required = false;
    }
}

// Event listeners para radio buttons
pacienteRadio.addEventListener('change', togglePadecimiento);
familiarRadio.addEventListener('change', togglePadecimiento);

// Inicializar estado
togglePadecimiento();

// Validación del formulario
if (form) {
    form.addEventListener('submit', function(e) {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const tipoUsuario = document.querySelector('input[name="tipo_usuario"]:checked').value;
        const padecimiento = padecimientoSelect.value;
        
        let valid = true;
        let msg = '';
        let icon = 'error';

        // Validar nombre
        if (!nombre) {
            valid = false;
            msg = 'El nombre es obligatorio.';
        } else if (nombre.length < 2) {
            valid = false;
            msg = 'El nombre debe tener al menos 2 caracteres.';
        }
        // Validar email
        else if (!email) {
            valid = false;
            msg = 'El correo es obligatorio.';
        } else if (!isValidEmail(email)) {
            valid = false;
            msg = 'Ingresa un correo válido.';
        }
        // Validar contraseña
        else if (!password || password.length < 6) {
            valid = false;
            msg = 'La contraseña debe tener al menos 6 caracteres.';
        }
        // Validar padecimiento si es paciente
        else if (tipoUsuario === 'paciente' && !padecimiento) {
            valid = false;
            msg = 'Debes seleccionar una enfermedad o padecimiento.';
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
        } else {
            // Mostrar loading antes de enviar
            Swal.fire({
                title: 'Registrando...',
                text: 'Por favor espera mientras procesamos tu registro',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
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
        title: '¡Registro Exitoso!',
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
        title: 'Error en el Registro',
        text: message,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d72660',
        background: 'rgba(255,255,255,0.95)',
        backdrop: 'rgba(0,0,0,0.4)'
    });
}

// Función para mostrar confirmación
function showConfirmation(message, callback) {
    Swal.fire({
        title: 'Confirmar Acción',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d72660',
        cancelButtonColor: '#6c757d',
        background: 'rgba(255,255,255,0.95)',
        backdrop: 'rgba(0,0,0,0.4)'
    }).then((result) => {
        if (result.isConfirmed && callback) {
            callback();
        }
    });
}
