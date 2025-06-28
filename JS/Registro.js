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

// Función para validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función principal de registro
const crearCuenta = async () => {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const tipoUsuario = document.querySelector('input[name="tipo_usuario"]:checked').value;
    const padecimiento = padecimientoSelect.value;
    
    // Validaciones
    if (!nombre) {
        Swal.fire({
            title: 'Error de Validación',
            text: 'El nombre es obligatorio.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660',
            background: 'rgba(255,255,255,0.95)',
            backdrop: 'rgba(0,0,0,0.4)'
        });
        return;
    }
    
    if (nombre.length < 2) {
        Swal.fire({
            title: 'Error de Validación',
            text: 'El nombre debe tener al menos 2 caracteres.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660',
            background: 'rgba(255,255,255,0.95)',
            backdrop: 'rgba(0,0,0,0.4)'
        });
        return;
    }
    
    if (!email) {
        Swal.fire({
            title: 'Error de Validación',
            text: 'El correo es obligatorio.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660',
            background: 'rgba(255,255,255,0.95)',
            backdrop: 'rgba(0,0,0,0.4)'
        });
        return;
    }
    
    if (!isValidEmail(email)) {
        Swal.fire({
            title: 'Error de Validación',
            text: 'Ingresa un correo válido.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660',
            background: 'rgba(255,255,255,0.95)',
            backdrop: 'rgba(0,0,0,0.4)'
        });
        return;
    }
    
    if (!password || password.length < 6) {
        Swal.fire({
            title: 'Error de Validación',
            text: 'La contraseña debe tener al menos 6 caracteres.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660',
            background: 'rgba(255,255,255,0.95)',
            backdrop: 'rgba(0,0,0,0.4)'
        });
        return;
    }
    
    if (tipoUsuario === 'paciente' && !padecimiento) {
        Swal.fire({
            title: 'Error de Validación',
            text: 'Debes seleccionar una enfermedad o padecimiento.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660',
            background: 'rgba(255,255,255,0.95)',
            backdrop: 'rgba(0,0,0,0.4)'
        });
        return;
    }

    // Mostrar loading
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

    try {
        const userData = {
            nombre,
            email,
            password,
            tipo_usuario: tipoUsuario,
            padecimiento: tipoUsuario === 'paciente' ? padecimiento : ''
        };

        const response = await fetch('PHP/Registro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        Swal.close();

        if (data.success) {
            Swal.fire({
                title: '¡Registro Exitoso!',
                text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
                icon: 'success',
                confirmButtonText: 'Iniciar Sesión',
                confirmButtonColor: '#d72660',
                background: 'rgba(255,255,255,0.95)',
                backdrop: 'rgba(0,0,0,0.4)',
                timer: 3000,
                timerProgressBar: true
            }).then(() => {
                window.location.href = 'Index.html';
            });
        } else {
            Swal.fire({
                title: 'Error en el Registro',
                text: data.message || 'Hubo un problema al crear tu cuenta. Por favor intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#d72660',
                background: 'rgba(255,255,255,0.95)',
                backdrop: 'rgba(0,0,0,0.4)'
            });
        }
    } catch (error) {
        Swal.close();
        Swal.fire({
            title: 'Error de Conexión',
            text: 'No se pudo conectar con el servidor',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660',
            background: 'rgba(255,255,255,0.95)',
            backdrop: 'rgba(0,0,0,0.4)'
        });
        console.error('Error:', error);
    }
};

// Event listener para el formulario
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        crearCuenta();
    });
}
