// Validación básica del formulario de registro
const form = document.getElementById('registerForm');
const tipoRadios = document.getElementsByName('tipo_usuario');
const padecimientoGroup = document.getElementById('padecimiento-group');
const padecimientoSelect = document.getElementById('padecimiento');

function togglePadecimiento() {
    if (document.querySelector('input[name="tipo_usuario"]:checked').value === 'paciente') {
        padecimientoGroup.style.display = 'flex';
    } else {
        padecimientoGroup.style.display = 'none';
        padecimientoSelect.value = '';
    }
}

if (tipoRadios) {
    tipoRadios.forEach(radio => {
        radio.addEventListener('change', togglePadecimiento);
    });
    togglePadecimiento();
}

if (form) {
    form.addEventListener('submit', function(e) {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const tipo = document.querySelector('input[name="tipo_usuario"]:checked').value;
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
        } else if (tipo === 'paciente' && !padecimientoSelect.value) {
            valid = false;
            msg = 'Selecciona una enfermedad o padecimiento.';
        }
        if (!valid) {
            e.preventDefault();
            alert(msg);
        }
    });
}
