// Validación del formulario de login con SweetAlert2
const form = document.getElementById('loginForm');

// Función para validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función principal de login
const iniciarSesion = async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validaciones
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

    // Mostrar loading
    Swal.fire({
        title: 'Iniciando sesión...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const response = await fetch('PHP/Index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        Swal.close();

        if (data.success) {
            Swal.fire({
                title: '¡Bienvenido!',
                text: `¡Bienvenido, ${data.nombre}!`,
                icon: 'success',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#d72660',
                background: 'rgba(255,255,255,0.95)',
                backdrop: 'rgba(0,0,0,0.4)',
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                if (data.tipo_usuario === 'paciente') {
                    // Si el paciente ya tiene perfil completo, ir al dashboard
                    if (data.perfil_completo) {
                        window.location.href = 'dashboard-paciente.html';
                    } else {
                        // Si no tiene perfil completo, ir al wizard
                        window.location.href = 'wizard-paciente.html';
                    }
                } else {
                    window.location.href = 'dashboard-familiar.html';
                }
            });
        } else {
            Swal.fire({
                title: 'Error de Acceso',
                text: data.message || 'Credenciales incorrectas',
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
        iniciarSesion();
    });
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
