// Dashboard Familiar - Kirei

document.addEventListener('DOMContentLoaded', function() {
    verificarVinculacion();
});

function verificarVinculacion() {
    fetch('PHP/get-paciente-familiar.php')
        .then(r => r.json())
        .then(data => {
            if (data.success && data.paciente) {
                mostrarDatosPaciente(data.paciente);
            } else {
                pedirCodigoVinculacion();
            }
        })
        .catch(() => mostrarError('Error al conectar con el servidor.'));
}

function pedirCodigoVinculacion() {
    Swal.fire({
        title: 'Vincular paciente',
        text: 'Por favor, ingresa el código de vinculación proporcionado por el paciente para ver sus datos.',
        input: 'text',
        inputLabel: 'Código de vinculación',
        inputPlaceholder: 'Ejemplo: ABC123',
        confirmButtonText: 'Vincular',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: (codigo) => {
            if (!codigo || codigo.trim() === '') {
                Swal.showValidationMessage('Debes ingresar un código válido.');
                return false;
            }
            return codigo.trim();
        }
    }).then(res => {
        if (res.isConfirmed && res.value) {
            vincularFamiliar(res.value);
        }
    });
}

function vincularFamiliar(codigo) {
    fetch('PHP/guardar-codigo-vinculacion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mostrarToast('Vinculación exitosa', data.message, 'success');
            setTimeout(() => location.reload(), 1200);
        } else {
            mostrarToast('Error', data.message || 'No se pudo vincular', 'danger');
        }
    })
    .catch(() => mostrarToast('Error', 'Error de red', 'danger'));
}

function mostrarToast(titulo, mensaje, tipo) {
    // Si usas Bootstrap Toasts, aquí va la lógica. Si no, usa alert como fallback.
    if (window.bootstrap) {
        const toastEl = document.getElementById('toast-vinculacion');
        if (toastEl) {
            toastEl.querySelector('.toast-header strong').textContent = titulo;
            toastEl.querySelector('.toast-body').textContent = mensaje;
            toastEl.className = 'toast align-items-center text-bg-' + (tipo === 'success' ? 'success' : 'danger');
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
            return;
        }
    }
    alert(titulo + ': ' + mensaje);
}

function mostrarDatosPaciente(p) {
    document.getElementById('nombrePaciente').textContent = p.nombre || '-';
    document.getElementById('edadPaciente').textContent = calcularEdad(p.fecha_nac) + ' años';
    document.getElementById('generoPaciente').textContent = p.genero || '-';
    document.getElementById('paisPaciente').textContent = p.pais || '-';
    document.getElementById('sangrePaciente').textContent = p.tipo_sangre || '-';
    document.getElementById('padecimientoPaciente').textContent = p.padecimiento || '-';
    document.getElementById('diagnosticoPaciente').textContent = p.fecha_diagnostico || '-';
    document.getElementById('medicoPaciente').textContent = p.medico || '-';
    document.getElementById('especialidadPaciente').textContent = p.especialidad_medico || '-';
    document.getElementById('telefonoPaciente').textContent = p.telefono_medico || '-';
    document.getElementById('dietaPaciente').textContent = p.dieta || '-';
    document.getElementById('alergiasPaciente').textContent = p.alergias || 'Ninguna';
    document.getElementById('contactoPaciente').textContent = (p.contacto_nombre ? p.contacto_nombre : '-') + (p.contacto_relacion ? ' (' + p.contacto_relacion + ')' : '');
    if (p.imagen && p.imagen.trim() !== '') {
        document.getElementById('imgPaciente').src = p.imagen;
    }
    document.querySelector('main').style.display = '';
}

function calcularEdad(fechaNac) {
    if (!fechaNac) return '-';
    const fecha = new Date(fechaNac);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
    }
    return edad;
}

function mostrarError(msg) {
    Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d72660'
    });
    document.querySelector('main').style.display = 'none';
}

document.querySelector('main').style.display = 'none'; 